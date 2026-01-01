from PIL import Image
import collections

def get_dominant_color(image_path):
    img = Image.open(image_path)
    img = img.convert("RGBA")
    
    # Resize for faster processing
    img = img.resize((100, 100))
    
    colors = []
    for x in range(img.width):
        for y in range(img.height):
            r, g, b, a = img.getpixel((x, y))
            # Ignore transparent or near-white/black pixels
            if a > 200 and not (r > 240 and g > 240 and b > 240) and not (r < 15 and g < 15 and b < 15):
                colors.append((r, g, b))
    
    if not colors:
        return None
        
    counter = collections.Counter(colors)
    most_common = counter.most_common(1)[0][0]
    return most_common

color = get_dominant_color("/home/ubuntu/tredfi-onboarding/client/public/images/logo.png")
if color:
    print(f"Dominant RGB: {color}")
    print(f"Hex: #{color[0]:02x}{color[1]:02x}{color[2]:02x}")
else:
    print("No dominant color found")
