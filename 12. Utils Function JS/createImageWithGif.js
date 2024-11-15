function getFirstFrameUrl(gifUrl) {
    const urlParts = gifUrl.split('/image/upload/');
    if (urlParts.length === 2) {
        return `${urlParts[0]}/image/upload/pg_1/${urlParts[1]}`;
    }
    throw new Error('Invalid Cloudinary GIF URL format');
}

// Ví dụ sử dụng:
const originalUrl = 'https://res.cloudinary.com/dvybgdkxc/image/upload/v1731665134/htj7zzbup4agkvbfoai1.gif';
const firstFrameUrl = getFirstFrameUrl(originalUrl);

console.log(firstFrameUrl);
// Kết quả: https://res.cloudinary.com/dvybgdkxc/image/upload/pg_1/v1731665134/htj7zzbup4agkvbfoai1.gif
