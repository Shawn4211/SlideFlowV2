from PIL import Image, ImageDraw

def make_circle_transparent():
    # Open the image
    img = Image.open('c:\\Projects\\SlideFlow\\TeamLogo.png').convert("RGBA")
    
    # Create the transparent mask
    mask = Image.new('L', img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, img.size[0], img.size[1]), fill=255)
    
    # Apply the mask
    output = img.copy()
    output.putalpha(mask)

    # Save to public folder
    output.save('c:\\Projects\\SlideFlow\\public\\TeamLogo.png', format="PNG")
    print("Logo processed successfully")

if __name__ == "__main__":
    make_circle_transparent()
