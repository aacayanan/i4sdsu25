from ultralytics import YOLO
model = YOLO(r"C:\Users\aacay\Documents\Code\innovate4sdsu\scripts\runs\detect\train12\weights\best.pt")

# Very permissive thresholds to force any output if it exists
res = model.predict(source=0, show=True, conf=0.05, iou=0.90, imgsz=960, verbose=True)
