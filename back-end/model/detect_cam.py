import cv2
import torch
from pathlib import Path
from ultralytics import YOLO

WEIGHTS = "best.pt"
CONF = 0.2

COLORS = [
    (0, 255, 0),   (255, 0, 0),   (0, 0, 255),   (255, 255, 0),
    (0, 255, 255), (255, 0, 255), (128, 255, 0),  (0, 128, 255),
    (255, 128, 0), (128, 0, 255), (0, 255, 128),  (255, 0, 128),
]

def get_color(class_id):
    return COLORS[class_id % len(COLORS)]

def draw_detection(frame, box, class_name, confidence, class_id):
    x1, y1, x2, y2 = map(int, box.xyxy[0])
    color = get_color(class_id)
    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
    label = f"{class_name}: {confidence:.0%}"
    font = cv2.FONT_HERSHEY_SIMPLEX
    (tw, th), bl = cv2.getTextSize(label, font, 0.6, 2)
    cv2.rectangle(frame, (x1, y1 - th - bl - 4), (x1 + tw, y1), color, -1)
    cv2.putText(frame, label, (x1, y1 - bl - 2), font, 0.6, (255,255,255), 2, cv2.LINE_AA)

def load_model():
    weights = Path(WEIGHTS)
    if not weights.exists():
        raise FileNotFoundError(f"Weights not found: {weights}")
    return YOLO(str(weights))

def run_camera(model):
    device = "0" if torch.cuda.is_available() else "cpu"
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Cannot open camera!")
        return
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    import time
    fps_counter, fps_display, start_time = 0, 0, time.time()

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        results = model(frame, conf=CONF, device=device, verbose=False)
        count = 0
        for result in results:
            for box in result.boxes:
                draw_detection(frame, box, model.names[int(box.cls[0])], float(box.conf[0]), int(box.cls[0]))
                count += 1
        fps_counter += 1
        elapsed = time.time() - start_time
        if elapsed >= 1.0:
            fps_display = fps_counter / elapsed
            fps_counter = 0
            start_time = time.time()
        cv2.putText(frame, f"FPS: {fps_display:.1f} | Detected: {count}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,255), 2, cv2.LINE_AA)
        cv2.putText(frame, "Press [Q] to quit", (10, frame.shape[0]-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200,200,200), 1, cv2.LINE_AA)
        cv2.imshow("Food Detection - Camera", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    cap.release()
    cv2.destroyAllWindows()

def run_image(model):
    device = "0" if torch.cuda.is_available() else "cpu"
    path = input("\nImage path:\n> ").strip().strip('"')
    img_path = Path(path)
    if not img_path.exists():
        print(f"Image not found: {path}")
        return
    frame = cv2.imread(str(img_path))
    if frame is None:
        print("Cannot open image!")
        return
    results = model(frame, conf=CONF, device=device, verbose=False)
    count = 0
    detected = []
    for result in results:
        for box in result.boxes:
            name = model.names[int(box.cls[0])]
            conf = float(box.conf[0])
            draw_detection(frame, box, name, conf, int(box.cls[0]))
            detected.append(f"{name} ({conf:.0%})")
            count += 1
    print(f"\nDetected {count} items:")
    for d in detected:
        print(f"  - {d}")
    output = img_path.parent / f"result_{img_path.name}"
    cv2.imwrite(str(output), frame)
    print(f"Saved: {output}")
    cv2.imshow("Food Detection - Image", frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def main():
    print("\n1 - Camera\n2 - Image\n")
    choice = input("Choose (1 or 2): ").strip()
    model = load_model()
    if choice == "1":
        run_camera(model)
    elif choice == "2":
        run_image(model)
    else:
        print("Invalid choice!")

if __name__ == "__main__":
    main()
