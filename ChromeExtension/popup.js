document.getElementById('upload').addEventListener('change', handleFileUpload);
document.getElementById('search').addEventListener('click', searchOutfit);
document.getElementById('save').addEventListener('click', saveImage);
document.addEventListener('paste', handlePasteEvent);

//appwrite config
const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66954f3c00112d2684eb');
const storage = new Appwrite.Storage(client);

let uploadedFile;

function handleFileUpload(event) {
    const file = event.target.files[0];
    processFile(file);
}

function handlePasteEvent(event) {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile();
            processFile(file);
        }
    }
}

function processFile(file) {
    if (file && file.size <= 5 * 1024 * 1024) { // Check if the file size is <= 5MB
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadBox = document.getElementById('uploadBox');
            const uploadIcon = document.getElementById('uploadIcon');

            // Remove the existing image if it exists
            const existingImage = document.querySelector('.uploadedImage');
            if (existingImage) {
                existingImage.remove();
            }

            // Hide the upload icon and text
            uploadIcon.style.display = 'none';
            uploadBox.querySelector('p').style.display = 'none';

            // Create a new image element and display the uploaded image
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'uploadedImage';
            uploadBox.appendChild(img);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload an image with a size of 5MB or less.');
    }
}


function searchOutfit() {
    fetch('dummydataTest.json')
        .then(response => response.json())
        .then(data => {
            displayResults(data.dress);
        })
        .catch(error => console.error('Error fetching the items:', error));
}

function displayResults(items) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'result-item';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;

        const details = document.createElement('div');
        details.className = "details";

        const link = document.createElement('a');
        link.href = item.link;
        link.textContent = "Link";
        link.target = '_blank'; // Open in new tab

        const name = document.createElement('p');
        name.textContent = item.name

        const price = document.createElement('div')
        price.className = "price",
        price.textContent = item.price

        details.appendChild(name);
        details.appendChild(price);
        details.appendChild(link);

        itemDiv.appendChild(img);
        itemDiv.appendChild(details);
        

        resultsDiv.appendChild(itemDiv);
    });
}

async function saveImage() {
    if (!uploadedFile) {
        alert('No image uploaded to save.');
        return;
    }

    try {
        const response = await storage.createFile(
            '66955544000394979b38',
            Appwrite.ID.unique(),
            uploadedFile
        );
        alert('Image saved successfully: ' + response.$id);
    } catch (error) {
        console.error('Error saving the image:', error);
        alert('Error saving the image.');
    }
}
