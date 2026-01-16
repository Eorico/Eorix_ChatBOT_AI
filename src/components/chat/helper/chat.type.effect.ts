export const typeMessage = (fullTxT: string, callback: (currentTxt: string) => void, delay = 30) => {
    let index = 0 ;
    const interval = setInterval(() => {
        index++;
        callback(fullTxT.slice(0, index));
        if (index >= fullTxT.length) {
            clearInterval(interval);
        }
    }, delay);
}
