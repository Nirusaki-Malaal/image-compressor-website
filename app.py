from flask import Flask , send_file, request, render_template, after_this_request
from flask_cors import CORS
import asyncio,os
app = Flask("backend")
CORS(app)

def output_filename(filename: str):
    ext = ""
    file_without_ext=""
    k=0
    i = len(filename)-1
    while i>=0:
        if filename[i] == '.':
            k=i
            break
        else:
            ext+=filename[i]
        i-=1
    ext = ext[::-1]
    i=0
    while i<k:
         file_without_ext+=filename[i]
         i+=1
    outputname = file_without_ext + "_compressed" + '.' + ext
    print(outputname)
    return outputname

@app.route("/compress", methods=["POST"])
async def compress():
    file = request.files["image"]
    file.save(file.filename) 
    dir = file.filename
    output = output_filename(dir)
    cmd  = f'ffmpeg -i "{dir}" -compression_level 9 -y "{output}"'
    @after_this_request
    def cleanup(photo):
        try:
            os.remove(dir)
        except:
            pass
        try:
            os.remove(output)
        except:
            pass
        return photo
    try: ## if error in process like ffmpeg not found bhai use sudo apt install ffmepg , dnf install ffmpeg , pacman -S ffmpeg anything you like bitch
        process = await asyncio.create_subprocess_shell(cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
        stdout, stderr = await process.communicate()
        return send_file(output,as_attachment=True)
    except:
        return 404
    
@app.route("/") 
def home():
    return render_template("index.html")

app.run(debug=True, port=5000)