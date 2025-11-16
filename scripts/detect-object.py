from ultralytics import YOLO
import cv2
import math
import numpy as np

# --- Model ---
model = YOLO("yolo-Weights/yolov8n.pt")
model_conf = 0.35  # try 0.25–0.5 depending on lighting/distance
model_names = model.model.names  # {id: name}

print("[INFO] Model classes:", list(model_names.values()))  # helps debugging once at start

# Map your logical buckets to *COCO* class names that the model actually knows
RECYCLE_CLASSES = {"bottle", "cup"}   # add more if relevant for your setup
TRASH_CLASSES   = {"banana", "apple", "orange", "broccoli", "carrot"}  # example "waste" cues; tweak as you wish

# --- Video ---
cap = cv2.VideoCapture(0)
cap.set(3, 640)
cap.set(4, 480)

# --- Motion background subtractor ---
fgbg = cv2.createBackgroundSubtractorMOG2(history=100, varThreshold=64, detectShadows=True)
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

def merge_boxes(boxes, overlapThresh=0.4):
    if len(boxes) == 0:
        return []
    boxes = np.array(boxes)
    x1 = boxes[:, 0]; y1 = boxes[:, 1]
    x2 = boxes[:, 0] + boxes[:, 2]; y2 = boxes[:, 1] + boxes[:, 3]
    area = (x2 - x1 + 1) * (y2 - y1 + 1)
    idxs = np.argsort(y2)
    pick = []
    while len(idxs) > 0:
        last = len(idxs) - 1
        i = idxs[last]
        pick.append(i)
        xx1 = np.maximum(x1[i], x1[idxs[:last]])
        yy1 = np.maximum(y1[i], y1[idxs[:last]])
        xx2 = np.minimum(x2[i], x2[idxs[:last]])
        yy2 = np.minimum(y2[i], y2[idxs[:last]])
        w = np.maximum(0, xx2 - xx1 + 1)
        h = np.maximum(0, yy2 - yy1 + 1)
        overlap = (w * h) / area[idxs[:last]]
        idxs = np.delete(idxs, np.concatenate(([last], np.where(overlap > overlapThresh)[0])))
    return boxes[pick].astype("int")

while True:
    ok, img = cap.read()
    if not ok:
        break
    img = cv2.flip(img, 1)

    # --- Run YOLO on this frame ---
    res = model.predict(img, conf=model_conf, verbose=False)[0]
    boxes = res.boxes  # may be empty

    # Count hits per logical bucket
    recycle_hits, trash_hits = 0, 0
    dets_for_display = []  # (x1,y1,x2,y2, name, conf)

    for i in range(len(boxes)):
        cls_id = int(boxes.cls[i].item())
        conf = float(boxes.conf[i].item())
        name = model_names.get(cls_id, str(cls_id))

        # tally buckets
        lname = name.lower()
        if lname in RECYCLE_CLASSES:
            recycle_hits += 1
        if lname in TRASH_CLASSES:
            trash_hits += 1

        # save for drawing (we draw either way when on the object path)
        x1, y1, x2, y2 = boxes.xyxy[i].cpu().numpy().astype(int)
        dets_for_display.append((x1, y1, x2, y2, name, conf))

    # Decide pathway by item
    if recycle_hits > 0 or trash_hits > 0:
        # --- OBJECT DETECTION PATH ---
        tag = "recycle" if recycle_hits > 0 else "trash"
        for (x1, y1, x2, y2, name, conf) in dets_for_display:
            # only highlight classes in our buckets to reduce clutter (optional)
            if name.lower() in RECYCLE_CLASSES.union(TRASH_CLASSES):
                color = (255, 0, 255) if name.lower() in RECYCLE_CLASSES else (0, 165, 255)
                cv2.rectangle(img, (x1, y1), (x2, y2), color, 3)
                cv2.putText(img, f"{name} {conf:.2f} [{tag}]",
                            (x1, max(0, y1-8)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        cv2.imshow("Webcam", img)

    else:
        # --- GENERAL MOTION DETECTION PATH ---
        fgmask = fgbg.apply(img, learningRate=0.001)
        fgmask = np.where(fgmask == 255, 255, 0).astype('uint8')  # drop shadows
        fgmask = cv2.medianBlur(fgmask, 5)
        fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_OPEN, kernel, iterations=2)
        fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_CLOSE, kernel, iterations=2)

        contours, _ = cv2.findContours(fgmask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        boxes = []
        for c in contours:
            area = cv2.contourArea(c)
            if area > 2000:
                x, y, w, h = cv2.boundingRect(c)
                boxes.append((x, y, w, h))

        merged_boxes = merge_boxes(boxes, overlapThresh=0.4)

        filtered = []
        for i, (x1, y1, w1, h1) in enumerate(merged_boxes):
            inside = False
            for j, (x2, y2, w2, h2) in enumerate(merged_boxes):
                if i != j and (x1 > x2 and y1 > y2 and x1+w1 < x2+w2 and y1+h1 < y2+h2):
                    inside = True
                    break
            if not inside:
                filtered.append((x1, y1, w1, h1))

        for (x, y, w, h) in filtered:
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

        cv2.imshow('Webcam', img)
        cv2.imshow('Mask', fgmask)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
