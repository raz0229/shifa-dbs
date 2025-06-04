export async function compressImage(file, maxWidth = 500, maxHeight = 600) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate the new dimensions while maintaining aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height *= maxWidth / width));
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width *= maxHeight / height));
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert the canvas to a base64 string
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // You can adjust quality from 0 to 1
                resolve(compressedBase64);
            };

            img.onerror = () => reject('Image load error');
        };

        reader.onerror = () => reject('File read error');
        reader.readAsDataURL(file);
    });
}