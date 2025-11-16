from ultralytics import YOLO

# Start from a pretrained backbone but train on your 2-class dataset
model = YOLO("yolov8n.pt")
results = model.train(
    data=r"C:\Users\aacay\Documents\Code\innovate4sdsu\scripts\models\yolo-waste-detection\data.yaml",  # must define 2 names
    epochs=50,
    imgsz=640
)

# After training finishes, note the saved run folder:
print("Saved to:", results)
# -> e.g. runs/detect/train3/weights/best.pt
