import urllib.request
import json 
import epd7in5
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont


EPD_WIDTH = 640
EPD_HEIGHT = 384

def main():
    epd = epd7in5.EPD()
    epd.init()

    url = 'https://api.nasa.gov/planetary/apod?api_key=n0OdkEMGNnqqBQ7RHSGTx7U4OnwrMCAporxkvCEu'
    response = urllib.request.urlopen(url)
    data = response.read()      # a `bytes` object
    text = data.decode('utf-8') # a `str`; this step can't be used if data is binary

    # parse text:
    y = json.loads(text)

    #the result is a Python dictionary:
    image_url  = y["url"]
    image_name = image_url.split('/')[-1]
    image_name = image_name.split('.')[0]

    # PIL
    font = ImageFont.truetype('../Fonts/roboto/Roboto-Bold.ttf', 24)

    image_path = "../Images/" + image_name + ".bmp"

    print(image_url) 
    print(image_name)
    urllib.request.urlretrieve(image_url,image_path)

    print("Converting to dithering gray scale")

    image = Image.open(image_path)
    newsize = (EPD_WIDTH, EPD_HEIGHT) 
    image = image.resize(newsize) 
    image = image.convert('1') 

    image_path = "../Images/" + image_name + "_dithered.bmp"

    image.save(image_path)

    #EDP
    epd.display_frame(epd.get_frame_buffer(image))

if __name__ == '__main__':
    main()
