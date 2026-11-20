import io
from PIL import Image
from backend.app.ai_service import classifier_service

def test_classifier_returns_valid_category_and_confidence():
    # Create synthetic test image in memory
    img = Image.new("RGB", (224, 224), color=(73, 109, 137))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    image_bytes = buffer.getvalue()

    result = classifier_service.classify_image(image_bytes)
    assert "category" in result
    assert result["category"] in ["overflowing_bin", "mixed_waste", "recyclable_waste", "other"]
    assert 0.0 <= result["confidence"] <= 1.0
    assert 1 <= result["severity"] <= 5
    assert "display_name" in result
