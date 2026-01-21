function getDirectory()
{
    
    const input = document.getElementById('dir');
    const loader = document.getElementById('loader');
    const btnText = document.getElementById('btn-text');
    const status = document.getElementById('status-msg');
    const btn = document.getElementById('submit-btn');
    let dir_obj = document.getElementById("dir");
    let name = dir_obj.files[0]["name"];
    console.log(name);
    if(dir_obj.files.length == 0)
    {
        alert("BITCH SELECT A FILE");
    }
    else

    {
        let file_obj =dir_obj.files[0];
        const formData = new FormData();
        formData.append("image", file_obj);
        fetch("/compress", {'method' :"POST" ,body: formData }).then(response => {
            if(response.text != 404) 
                {return response.blob();
            
            }
            else
            {
                alert("File Failed To Compress");
            }
            status.style.display = 'none';
            btn.disabled = true;
            btnText.textContent = "CRUSHING...";
            loader.style.display = 'block';
        }).then
        (blob => { // blob is your packet of image as an object 
            const url = URL.createObjectURL(blob); // temporary internal url type shit
            const a = document.createElement("a"); // creating an anchor element
            a.href = url; // setting url for anchor element
            a.download = outputname(name);  // download file name
            document.body.appendChild(a); // appending it to the body
            a.click(); // clicking the tag
            a.remove(); // removing the tag
        });
        
    }
}

function outputname(name) {
    let ext = '';
    let file_without_ext='';
    let k;
    for (let i = name.length-1; i >=0; i--) 
    {
        if(name[i] === '.')
        {
            k=i;
            break;
        }
        else
        {
            ext+=name[i];
        }
    }
    ext = reverseString(ext)
    for(let i =0; i<k;i++)
    {
        file_without_ext+=name[i]
    }
    console.log(file_without_ext)
    let outputname = file_without_ext + "_compressed" + '.' + ext;
    return outputname
}

function reverseString(str) {
  let newString = "";
  for (let i = str.length - 1; i >= 0; i--) {
    newString += str[i]; 
  }
  return newString;
}

function toggleTheme() {
            const body = document.body;
            body.classList.toggle('light-mode');
}

function showFileName() {
            const input = document.getElementById('dir');
            const display = document.getElementById('file-name');
            const label = document.querySelector('.file-upload-label');
            const labelText = document.querySelector('.upload-text');
            if (input.files && input.files.length > 0) {
                display.textContent = "TARGET: " + input.files[0].name.toUpperCase();
                label.style.borderColor = 'var(--reiatsu-orange)';
                labelText.textContent = "Target Locked";
                labelText.style.color = "var(--reiatsu-orange)";
            } else {
                display.textContent = "";
                label.style.borderColor = 'var(--shinigami-black)';
                labelText.textContent = "Select Spirit Particle (Image)";
                labelText.style.color = "var(--shinigami-black)";
            }
            document.getElementById('status-msg').style.display = 'none';
}
