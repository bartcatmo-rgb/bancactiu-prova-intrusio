import os
import math
from PIL import Image, ImageDraw

def create_cat_no_no(output_path):
    frames = []
    width, height = 280, 280
    num_frames = 24
    
    for i in range(num_frames):
        # Progress 0 to 2*pi
        t = (i / num_frames) * 2 * math.pi
        head_angle = math.sin(t * 2) * 14 # head shakes back and forth twice per loop
        head_offset_x = math.sin(t * 2) * 18
        
        # Create image with RGBA transparent background
        img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Center of canvas
        cx, cy = width // 2, height // 2
        
        # Body (stays mostly still, slight squash)
        body_y = cy + 40
        draw.ellipse([cx - 55, body_y - 20, cx + 55, body_y + 80], fill=(255, 175, 65), outline=(50, 25, 0), width=4)
        # Belly
        draw.ellipse([cx - 35, body_y, cx + 35, body_y + 65], fill=(255, 235, 190), outline=(50, 25, 0), width=3)
        
        # Paws
        paw_l_y = body_y + 25 + int(math.sin(t) * 3)
        paw_r_y = body_y + 25 - int(math.sin(t) * 3)
        draw.ellipse([cx - 48, paw_l_y, cx - 18, paw_l_y + 24], fill=(255, 245, 220), outline=(50, 25, 0), width=3)
        draw.ellipse([cx + 18, paw_r_y, cx + 48, paw_r_y + 24], fill=(255, 245, 220), outline=(50, 25, 0), width=3)
        
        # Head center
        hx = cx + head_offset_x
        hy = cy - 20
        
        # Ears (rotate with head)
        rad = math.radians(head_angle)
        cos_a, sin_a = math.cos(rad), math.sin(rad)
        
        def rot(px, py):
            dx, dy = px - cx, py - hy
            rx = dx * cos_a - dy * sin_a
            ry = dx * sin_a + dy * cos_a
            return (hx + rx, hy + ry)
        
        # Left ear
        e1 = [rot(cx - 50, hy - 40), rot(cx - 20, hy - 75), rot(cx - 5, hy - 40)]
        draw.polygon(e1, fill=(255, 150, 40), outline=(50, 25, 0))
        e1_in = [rot(cx - 42, hy - 42), rot(cx - 22, hy - 67), rot(cx - 12, hy - 42)]
        draw.polygon(e1_in, fill=(255, 140, 160))
        
        # Right ear
        e2 = [rot(cx + 5, hy - 40), rot(cx + 20, hy - 75), rot(cx + 50, hy - 40)]
        draw.polygon(e2, fill=(255, 150, 40), outline=(50, 25, 0))
        e2_in = [rot(cx + 12, hy - 42), rot(cx + 22, hy - 67), rot(cx + 42, hy - 42)]
        draw.polygon(e2_in, fill=(255, 140, 160))
        
        # Head oval
        draw.ellipse([hx - 60, hy - 50, hx + 60, hy + 45], fill=(255, 180, 70), outline=(50, 25, 0), width=4)
        
        # Cheeks
        draw.ellipse([hx - 48, hy + 5, hx - 22, hy + 25], fill=(255, 140, 150, 180))
        draw.ellipse([hx + 22, hy + 5, hx + 48, hy + 25], fill=(255, 140, 150, 180))
        
        # Eyes (shaking, squinting or wide with "no" pupils)
        pupil_dx = math.sin(t * 2) * 5
        # Left eye
        draw.ellipse([hx - 36, hy - 20, hx - 12, hy + 8], fill=(255, 255, 255), outline=(50, 25, 0), width=3)
        draw.ellipse([hx - 27 + pupil_dx, hy - 14, hx - 17 + pupil_dx, hy - 2], fill=(20, 20, 20))
        draw.ellipse([hx - 25 + pupil_dx, hy - 12, hx - 21 + pupil_dx, hy - 7], fill=(255, 255, 255))
        
        # Right eye
        draw.ellipse([hx + 12, hy - 20, hx + 36, hy + 8], fill=(255, 255, 255), outline=(50, 25, 0), width=3)
        draw.ellipse([hx + 17 + pupil_dx, hy - 14, hx + 27 + pupil_dx, hy - 2], fill=(20, 20, 20))
        draw.ellipse([hx + 19 + pupil_dx, hy - 12, hx + 23 + pupil_dx, hy - 7], fill=(255, 255, 255))
        
        # Eyebrows (worried / animated no)
        brow_y = hy - 25 + int(math.sin(t * 2) * 3)
        draw.line([hx - 34, brow_y + 4, hx - 14, brow_y], fill=(70, 30, 0), width=3)
        draw.line([hx + 14, brow_y, hx + 34, brow_y + 4], fill=(70, 30, 0), width=3)
        
        # Nose
        draw.polygon([(hx - 6, hy + 2), (hx + 6, hy + 2), (hx, hy + 9)], fill=(255, 120, 140), outline=(50, 25, 0))
        
        # Mouth (w wavy mouth)
        draw.arc([hx - 16, hy + 6, hx, hy + 18], start=0, end=180, fill=(50, 25, 0), width=3)
        draw.arc([hx, hy + 6, hx + 16, hy + 18], start=0, end=180, fill=(50, 25, 0), width=3)
        
        # Whiskers
        draw.line([hx - 35, hy + 10, hx - 68, hy + 5], fill=(60, 30, 0), width=3)
        draw.line([hx - 35, hy + 15, hx - 65, hy + 20], fill=(60, 30, 0), width=3)
        draw.line([hx + 35, hy + 10, hx + 68, hy + 5], fill=(60, 30, 0), width=3)
        draw.line([hx + 35, hy + 15, hx + 65, hy + 20], fill=(60, 30, 0), width=3)
        
        # "NO" text or gesture badge
        if i % 8 < 4:
            badge_x = int(hx + (55 if head_offset_x > 0 else -75))
            draw.rectangle([badge_x, hy - 45, badge_x + 32, hy - 25], fill=(240, 50, 50), outline=(255, 255, 255), width=2)
            draw.text((badge_x + 4, hy - 44), "NO!", fill=(255, 255, 255))
        
        # Quantize frame with palette
        frame_p = img.convert("RGBA")
        frames.append(frame_p)
        
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=65,
        loop=0,
        disposal=2
    )
    print(f"Generated {output_path} successfully ({len(frames)} frames)")

def create_cat_dancing(output_path):
    frames = []
    width, height = 280, 280
    num_frames = 24
    
    for i in range(num_frames):
        t = (i / num_frames) * 2 * math.pi
        
        # Dancing bobbing and swaying
        sway_x = math.sin(t) * 22
        bounce_y = abs(math.sin(t * 2)) * 18
        ear_wiggle = math.sin(t * 4) * 8
        
        img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        cx = width // 2 + int(sway_x)
        cy = height // 2 - int(bounce_y) + 15
        
        # Tail swishing
        tail_tip_x = cx - 60 - int(math.sin(t * 2) * 25)
        tail_tip_y = cy + 20 + int(math.cos(t * 2) * 20)
        draw.arc([tail_tip_x, cy + 10, cx - 20, cy + 60], start=90, end=270, fill=(245, 160, 50), width=10)
        
        # Body
        draw.ellipse([cx - 45, cy - 10, cx + 45, cy + 70], fill=(255, 190, 70), outline=(40, 20, 0), width=4)
        draw.ellipse([cx - 28, cy + 8, cx + 28, cy + 58], fill=(255, 240, 200), outline=(40, 20, 0), width=2)
        
        # Legs / dancing feet
        l_foot_y = cy + 60 + int(math.sin(t) * 10)
        r_foot_y = cy + 60 - int(math.sin(t) * 10)
        draw.ellipse([cx - 38, l_foot_y, cx - 12, l_foot_y + 20], fill=(255, 245, 220), outline=(40, 20, 0), width=3)
        draw.ellipse([cx + 12, r_foot_y, cx + 38, r_foot_y + 20], fill=(255, 245, 220), outline=(40, 20, 0), width=3)
        
        # Dancing arms waving in the air
        l_arm_tip_y = cy - 20 + int(math.sin(t * 2) * 20)
        r_arm_tip_y = cy - 20 - int(math.sin(t * 2) * 20)
        draw.line([cx - 30, cy + 15, cx - 55, l_arm_tip_y], fill=(255, 190, 70), width=12)
        draw.ellipse([cx - 65, l_arm_tip_y - 10, cx - 45, l_arm_tip_y + 10], fill=(255, 245, 220), outline=(40, 20, 0), width=3)
        
        draw.line([cx + 30, cy + 15, cx + 55, r_arm_tip_y], fill=(255, 190, 70), width=12)
        draw.ellipse([cx + 45, r_arm_tip_y - 10, cx + 65, r_arm_tip_y + 10], fill=(255, 245, 220), outline=(40, 20, 0), width=3)
        
        # Head
        hy = cy - 45
        hx = cx
        
        # Ears (wiggle!)
        e1 = [(hx - 45, hy - 15), (hx - 22, hy - 48 + int(ear_wiggle)), (hx - 8, hy - 20)]
        draw.polygon(e1, fill=(255, 160, 45), outline=(40, 20, 0))
        e1_in = [(hx - 38, hy - 18), (hx - 22, hy - 40 + int(ear_wiggle)), (hx - 14, hy - 20)]
        draw.polygon(e1_in, fill=(255, 140, 160))
        
        e2 = [(hx + 8, hy - 20), (hx + 22, hy - 48 - int(ear_wiggle)), (hx + 45, hy - 15)]
        draw.polygon(e2, fill=(255, 160, 45), outline=(40, 20, 0))
        e2_in = [(hx + 14, hy - 20), (hx + 22, hy - 40 - int(ear_wiggle)), (hx + 38, hy - 18)]
        draw.polygon(e2_in, fill=(255, 140, 160))
        
        # Head oval
        draw.ellipse([hx - 50, hy - 32, hx + 50, hy + 42], fill=(255, 195, 80), outline=(40, 20, 0), width=4)
        
        # Rosy Cheeks
        draw.ellipse([hx - 42, hy + 8, hx - 20, hy + 24], fill=(255, 130, 150, 180))
        draw.ellipse([hx + 20, hy + 8, hx + 42, hy + 24], fill=(255, 130, 150, 180))
        
        # Happy closed dancing eyes (^ ^)
        draw.arc([hx - 32, hy - 12, hx - 12, hy + 4], start=180, end=360, fill=(40, 20, 0), width=4)
        draw.arc([hx + 12, hy - 12, hx + 32, hy + 4], start=180, end=360, fill=(40, 20, 0), width=4)
        
        # Nose
        draw.polygon([(hx - 5, hy + 4), (hx + 5, hy + 4), (hx, hy + 10)], fill=(255, 120, 140), outline=(40, 20, 0))
        
        # Big open happy singing mouth :D
        mouth_open = int(abs(math.sin(t * 3)) * 6) + 4
        draw.ellipse([hx - 12, hy + 12, hx + 12, hy + 14 + mouth_open], fill=(180, 20, 40), outline=(40, 20, 0), width=2)
        draw.ellipse([hx - 6, hy + 16, hx + 6, hy + 14 + mouth_open], fill=(255, 140, 160))
        
        # Whiskers
        draw.line([hx - 28, hy + 10, hx - 56, hy + 8], fill=(60, 30, 0), width=2)
        draw.line([hx - 28, hy + 15, hx - 54, hy + 18], fill=(60, 30, 0), width=2)
        draw.line([hx + 28, hy + 10, hx + 56, hy + 8], fill=(60, 30, 0), width=2)
        draw.line([hx + 28, hy + 15, hx + 54, hy + 18], fill=(60, 30, 0), width=2)
        
        # Floating musical notes
        note_y = hy - 40 - int(math.sin(t + 1) * 12)
        note_x = hx + 45 + int(math.cos(t) * 10)
        draw.text((note_x, note_y), "♪", fill=(255, 230, 60))
        note2_y = hy - 35 - int(math.cos(t) * 12)
        note2_x = hx - 55 - int(math.sin(t) * 8)
        draw.text((note2_x, note2_y), "♫", fill=(100, 240, 255))
        
        frame_p = img.convert("RGBA")
        frames.append(frame_p)
        
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=60,
        loop=0,
        disposal=2
    )
    print(f"Generated {output_path} successfully ({len(frames)} frames)")

if __name__ == "__main__":
    base_dirs = [
        r"C:\Users\Bart\Desktop\PROJECTE_ADMINISTRATIU_SANITARI\Projecte_amb_IA_avançada\bancactiu-prova-intrusio\public\assets\cats",
        r"C:\Users\Bart\Desktop\PROJECTE_ADMINISTRATIU_SANITARI\Projecte_amb_IA_avançada\bancactiu-prova-intrusio\apps\bancactiu-nexus\public\assets\cats"
    ]
    for d in base_dirs:
        create_cat_no_no(os.path.join(d, "cat-no-no.gif"))
        create_cat_dancing(os.path.join(d, "cat-dancing.gif"))
