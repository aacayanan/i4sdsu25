from ultralytics import YOLO
import cv2
import numpy as np
from collections import deque
from db_manager import init_db
from config import SUPABASE_KEY, SUPABASE_URL

# initialize supabase connection
try:
    db = init_db(SUPABASE_URL, SUPABASE_KEY)
    print("[INFO] Database connected successfully")
except Exception as e:
    print(f"[WARNING] Database connection failed: {e}.")
    db = None

model = YOLO(r".\runs\detect\train16\weights\best.pt")
model_conf = 0.6
print("[INFO] Model classes:", model.names)

TRACKING_FRAMES = 30  # Number of frames to track
DISAPPEAR_THRESHOLD = 10  # Frames with no detection before considering "thrown away"

# Create tracking storage
detection_history = deque(maxlen=TRACKING_FRAMES)
no_detection_count = 0
feedback_message = None
feedback_timer = 0
FEEDBACK_DISPLAY_FRAMES = 30

# --- Recycling grouping ---
RECYCLE = {
    "aluminum can", "aluminum caps", "cardboard", "cellulose", "foil",
    "glass bottle", "iron utensils", "milk bottle", "paper", "paper bag",
    "paper shavings", "scrap metal", "tin", "paper cups",
    "plastic bag", "plastic bottle", "plastic can", "plastic canister", "plastic caps",
    "plastic cup", "plastic shaker", "plastic shavings", "plastic toys"
}

SPECIAL = {
    "aerosols", "container for household chemicals", "electronics",
    "metal shavings", "tetra pack"
}

COLOR_RECYCLE = (0, 200, 0)  # green
COLOR_TRASH = (0, 0, 255)  # red
COLOR_SPECIAL = (0, 200, 255)  # yellow/cyan

# Motion setup
fgbg = cv2.createBackgroundSubtractorMOG2(history=100, varThreshold=64, detectShadows=True)
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))


def classify_bin(class_name: str):
    n = class_name.strip().lower()
    if n in RECYCLE:
        return "Recycle", COLOR_RECYCLE
    if n in SPECIAL:
        return "Special", COLOR_SPECIAL
    # default to Trash if unknown
    return "Trash", COLOR_TRASH


def analyze_history(history):
    """
    Analyze detection history to determine final classification.
    Returns: (verdict, confidence_pct)
    """
    if not history:
        return "Trash", 0

    recycle_count = sum(1 for h in history if h['bin'] == 'Recycle')
    special_count = sum(1 for h in history if h['bin'] == 'Special')
    trash_count = sum(1 for h in history if h['bin'] == 'Trash')

    total = len(history)
    recycle_pct = (recycle_count / total) * 100
    special_pct = (special_count / total) * 100

    # If majority (>50%) are recyclable
    if recycle_pct > 50:
        return "Recycle", recycle_pct
    elif special_pct > 30:  # Lower threshold for special items
        return "Special Handling", special_pct
    else:
        return "Trash", 100 - recycle_pct - special_pct


def draw_feedback_banner(img, message, verdict):
    """Draw a large feedback banner at the top of the screen."""
    h, w = img.shape[:2]

    # Color based on verdict
    if "Recycle" in verdict:
        color = (0, 200, 0)  # Green
    elif "Special" in verdict:
        color = (0, 200, 255)  # Yellow
    else:
        color = (0, 0, 255)  # Red

    # Draw semi-transparent banner
    overlay = img.copy()
    cv2.rectangle(overlay, (0, 0), (w, 100), color, -1)
    cv2.addWeighted(overlay, 0.7, img, 0.3, 0, img)

    # Draw text
    cv2.putText(img, message, (20, 60),
                cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 3)


def merge_boxes(boxes, overlapThresh=0.4):
    """boxes: [(x,y,w,h), ...] -> merged np.array([[x,y,w,h], ...])"""
    if not boxes:
        return []
    boxes = np.array(boxes, dtype=np.float32)
    x1 = boxes[:, 0];
    y1 = boxes[:, 1]
    x2 = boxes[:, 0] + boxes[:, 2];
    y2 = boxes[:, 1] + boxes[:, 3]
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
    cv2.putText(img, txt, (x1 + 3, y1 - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)


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
    names = getattr(res, "names", None)

    best = None
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

    # Track detection state
    if best is not None:
        conf, x1, y1, x2, y2, name = best
        tag, color = classify_bin(name)

        # Store detection in history
        detection_history.append({
            'name': name,
            'bin': tag,
            'conf': conf
        })
        no_detection_count = 0  # Reset counter

        draw_labeled_box(img, x1, y1, x2, y2, f"{tag}: {name} {conf:.2f}", color)

    else:
        # No YOLO detection - increment counter
        no_detection_count += 1

        # If object has disappeared (thrown away)
        if no_detection_count == DISAPPEAR_THRESHOLD and len(detection_history) > 5:
            # Analyze what was detected before it disappeared
            verdict, confidence = analyze_history(detection_history)

            if verdict == "Recycle":
                feedback_message = f"RECYCLABLE +5 POINTS"

            feedback_timer = FEEDBACK_DISPLAY_FRAMES

            # === DATABASE CALL ===
            if db and verdict == "Recycle":
                try:
                    db.update_user_points()
                except Exception as e:
                    print(f"[DB ERROR] {e}")

        # Clear history after extended absence
        if no_detection_count > DISAPPEAR_THRESHOLD + 15:
            detection_history.clear()

        # Fall back to motion detection (your existing code)
        fgmask = fgbg.apply(img, learningRate=0.001)
        fgmask = np.where(fgmask == 255, 255, 0).astype('uint8')
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
            areas = [(w * h, (x, y, w, h)) for (x, y, w, h) in merged]
            _, (x, y, w, h) = max(areas, key=lambda t: t[0])
            draw_labeled_box(img, x, y, x + w, y + h, "Trash", (0, 0, 255))

        cv2.imshow("Mask", fgmask)

    # Display feedback banner if active
    if feedback_timer > 0:
        verdict_type = "Recycle" if "RECYCLABLE" in feedback_message else \
            "Special" if "SPECIAL" in feedback_message else "Trash"
        draw_feedback_banner(img, feedback_message, verdict_type)
        feedback_timer -= 1

    cv2.imshow("Webcam", img)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
