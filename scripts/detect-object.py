from ultralytics import YOLO
import cv2
import numpy as np

# Load your trained weights (custom with classes ['recycle','trash'])
# model = YOLO("yolov8n.pt")
model = YOLO(r"C:\Users\aacay\Documents\Code\innovate4sdsu\scripts\runs\detect\train4\weights\best.pt")
model_conf = 0.05
print("[INFO] Model classes:", model.names)

# Motion setup
fgbg = cv2.createBackgroundSubtractorMOG2(history=100, varThreshold=64, detectShadows=True)
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

def merge_boxes(boxes, overlapThresh=0.4):
    """boxes: [(x,y,w,h), ...] -> merged np.array([[x,y,w,h], ...])"""
    if not boxes:
        return []
    boxes = np.array(boxes, dtype=np.float32)
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
    merged = boxes[pick].astype(int)
    return merged

def draw_labeled_box(img, x1, y1, x2, y2, label, color):
    """Draw one box + label anchored to the box."""
    cv2.rectangle(img, (x1, y1), (x2, y2), color, 3)
    txt = label
    (tw, th), bl = cv2.getTextSize(txt, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
    # text background
    cv2.rectangle(img, (x1, y1 - th - 8), (x1 + tw + 6, y1), color, -1)
    cv2.putText(img, txt, (x1 + 3, y1 - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)

cap = cv2.VideoCapture(0)
cap.set(3, 640)
cap.set(4, 480)

while True:
    ok, img = cap.read()
    if not ok:
        break
    img = cv2.flip(img, 1)

    # YOLO inference
    res = model.predict(img, conf=model_conf, verbose=False, imgsz=640)[0]
    boxes = res.boxes
    names = getattr(res, "names", None)  # usually {id: name}

    best = None  # (conf, x1,y1,x2,y2, name)
    if boxes is not None and len(boxes) > 0:
        for i in range(len(boxes)):
            conf = float(boxes.conf[i].item())
            x1, y1, x2, y2 = boxes.xyxy[i].cpu().numpy().astype(int)
            cls_id = int(boxes.cls[i].item())
            name = None
            if isinstance(names, dict) and cls_id in names:
                name = str(names[cls_id]).lower()
            elif isinstance(model.names, dict) and cls_id in model.names:
                name = str(model.names[cls_id]).lower()
            elif isinstance(model.names, (list, tuple)) and 0 <= cls_id < len(model.names):
                name = str(model.names[cls_id]).lower()
            else:
                name = f"id:{cls_id}"

            if (best is None) or (conf > best[0]):
                best = (conf, x1, y1, x2, y2, name)

    if best is not None:
        # YOLO path
        conf, x1, y1, x2, y2, name = best
        draw_labeled_box(img, x1, y1, x2, y2, f"{name} {conf:.2f}", (0, 200, 255))
        cv2.imshow("Webcam", img)
    else:
        # motion path (unchanged) ...

        # --- GENERAL MOTION DETECTION PATH (defaults to 'Trash') ---
        fgmask = fgbg.apply(img, learningRate=0.001)
        fgmask = np.where(fgmask == 255, 255, 0).astype('uint8')  # drop shadows
        fgmask = cv2.medianBlur(fgmask, 5)
        fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_OPEN, kernel, iterations=2)
        fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_CLOSE, kernel, iterations=2)

        contours, _ = cv2.findContours(fgmask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        rects = []
        for c in contours:
            if cv2.contourArea(c) > 2000:
                x, y, w, h = cv2.boundingRect(c)
                rects.append((x, y, w, h))

        merged = merge_boxes(rects, 0.4)

        if len(merged) > 0:
            # choose the largest box to enforce "one box"
            areas = [(w*h, (x,y,w,h)) for (x,y,w,h) in merged]
            _, (x, y, w, h) = max(areas, key=lambda t: t[0])
            # label ON the box as 'Trash'
            draw_labeled_box(img, x, y, x + w, y + h, "Trash", (0, 0, 255))

        cv2.imshow("Webcam", img)
        cv2.imshow("Mask", fgmask)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
