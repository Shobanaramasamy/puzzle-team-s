import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imageWidth, setImageWidth] = useState(820)
  const [croppedImages, setCroppedImages] = useState([])
  const [emptyValue, setEmptyValue] = useState(null)

  const handleSubmit = () => {

    var canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d"),
      parts = [],
      img = new Image();
    var matrix = [], k;

    img.onload = split;

    function split() {
      setImageWidth(img.width + 10)
      var w2 = img.width / 3,
        h2 = img.height / 3;

      for (var i = 0; i < 9; i++) {

        var x, y, j;

        if (i <= 2) {
          x = -i * img.width / 3;
          y = 0;
          j = i
        } else if (2 < i && i < 6) {
          x = -(i - 3) * img.width / 3;
          y = -img.height / 3;
          j = i - 3
        } else if (6 <= i) {
          x = -(i - 6) * img.width / 3;
          y = -(img.height / 3) * 2;
          j = i - 6
        }

        canvas.width = w2;
        canvas.height = h2;

        ctx.drawImage(this, x, y, w2 * 3, h2 * 3);

        parts.push(parts.length < 8 ? { img: canvas.toDataURL(), flag: 1 } : { img: null, flag: 0 });

      }

      for (i = 0, k = -1; i < parts.length; i++) {
        if (i % 3 === 0) {
          k++;
          matrix[k] = [];
        }
        matrix[k].push(parts[i]);
      }

      setCroppedImages(matrix)

      for (let k = 0; k < matrix.length; k++) {
        let i = matrix[k].length;
        if (i == 0)
          return false;
        else {
          while (--i) {
            let j = Math.floor(Math.random() * (i + 1));
            let tempi = matrix[k][i];
            let tempj = matrix[k][j];
            matrix[k][i] = tempj;
            matrix[k][j] = tempi;
          }
        }
      }
      localStorage.setItem('puzzle', JSON.stringify(matrix));
    }
    img.src = uploadedImage
  }


  !emptyValue &&
    croppedImages.map((e, indexi) => {
      return e.map((x, indexj) => {
        if (x.flag === 0) {
          setEmptyValue([indexi, indexj])
        }
      })
    })

  const handlePuzzle = (flag, indexi, indexj) => {

    if (((emptyValue[0] === indexi) || (emptyValue[1] === indexj)) && ((Math.abs(indexi - emptyValue[0]) === 1) || (Math.abs(indexj - emptyValue[1]) === 1))) {
      let temp = croppedImages[indexi][indexj]
      croppedImages[indexi][indexj] = croppedImages[emptyValue[0]][emptyValue[1]]
      croppedImages[emptyValue[0]][emptyValue[1]] = temp
      setEmptyValue([indexi, indexj])
      setCroppedImages(croppedImages);
      localStorage.setItem('puzzle', JSON.stringify(croppedImages));
      localStorage.setItem('puzzleImage', URL.createObjectURL(uploadedImage));
    } else if (flag === 0) {
      alert('Click other elements to move!')
    }
  }

  const handleChangeImage = () => {
    localStorage.clear();
    window.location.reload();
  }

  useEffect(() => {
    uploadedImage && handleSubmit()
  }, [uploadedImage])

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('puzzle'))) {
      setCroppedImages(JSON.parse(localStorage.getItem('puzzle')))
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginTop: '2rem' }}>
      Let's solve Puzzle!
      {JSON.parse(localStorage.getItem('puzzle')) === null &&
        <input type={'file'} name={'Select'} onChange={(e) => setUploadedImage(URL.createObjectURL(e.target.files[0]))} />}
      <div onClick={handleChangeImage}>
        {JSON.parse(localStorage.getItem('puzzle')) ? <button>Change Image</button> : null}
      </div>
      <div>
        {uploadedImage && <img width={300} src={uploadedImage} alt='uploaded-file' />}
      </div>
      { <div style={{
        display: 'flex',
        width: `${imageWidth}px`,
        gap: '3px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        border: '5px solid #000000',
        backgroundColor: 'white'
      }}>
        {croppedImages && croppedImages.map((e, indexi) => {
          return (
            e.map((x, indexj) => {
              return (
                <div
                  style={{ display: 'flex', gap: 0 }}
                  onClick={() => handlePuzzle(x.flag, indexi, indexj)}
                >
                  {x.img ? <img src={x.img} alt={indexj} /> : <img width={imageWidth / 3} alt={indexj} src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' />}
                </div>)
            }))
        })}
      </div>}

    </div >
  );
}

export default App;
