// Format Time Music

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
};

// Công thức Seekbar

let duration = 60000; // Tổng thời gian bài hát
let currentTime = 20000; // Thời gian hiện tại của bài hát

const seekBar = (currentTime / duration) * 100;
