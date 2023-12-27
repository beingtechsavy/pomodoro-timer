const timer={
    pomodoro:25,
    shortBreak:5,
    longBreak:15,
    longBreakInterval:4
};
let interval;

const mainButton=document.getElementById('js-btn');
mainButton.addEventListener('click',() =>{
    const {action}=mainButton.dataset;
    if(action==='start'){
        startTimer();
    }
    else{
        stopTimer();
    }
});






const modeButtons=document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click',handleMode);
function handleMode(event) {
    const {mode}=event.target.dataset;
    if(!mode) return;
    switchMode(mode);
    stopTimer();
}
function switchMode(mode) {
    timer.mode=mode;
    timer.remainingTime={
        total: timer[mode]*60,
        minutes: timer[mode],
        seconds:0,
    };
    document.querySelectorAll('button[data-mode]').forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor=`var(--${mode})`;
    
    updateClock();
}
document.getElementById("js-motivation").addEventListener('click',function (event) {
    document.getElementById("js-motivation").style.borderColor='#fff';
    
    setTimeout(function () {
        document.getElementById('js-motivation').style.borderColor = 'transparent';
    }, 2000);   
})

function getRemainingTime(endTime) {
    const currentTime=Date.parse(new Date());
    const difference=endTime-currentTime;
    const total=Number.parseInt(difference/1000,10);
    const minutes=Number.parseInt((total/60)%60,10);
    const seconds=Number.parseInt(total%60,10);
    return {total,minutes,seconds,};
}


function startTimer() {
    let {total}=timer.remainingTime;
    const endTime=Date.parse(new Date())+total*1000;
    mainButton.dataset.action='stop';
    mainButton.textContent='Ruk  Ja';
    mainButton.classList.add('active');
    
    interval=setInterval(function () {
        timer.remainingTime=getRemainingTime(endTime);
        updateClock();
        total=timer.remainingTime.total;
        if(total<=0){
            clearInterval(interval);
        }
    },1000);
}
function stopTimer() {
    clearInterval(interval);
    mainButton.dataset.action='start';
    mainButton.textContent='Shuru Ho';
    mainButton.classList.remove('active');
}

function updateClock() {
    const {remainingTime}=timer;
    const minutes=`${remainingTime.minutes}`.padStart(2,0);
    const seconds=`${remainingTime.seconds}`.padStart(2,0);
    
    const min=document.getElementById('js-minutes');
    const sec=document.getElementById('js-seconds');
    min.textContent=minutes;
    sec.textContent=seconds;
}
document.addEventListener('DOMContentLoaded',()=> {
    switchMode('pomodoro');
});

document.getElementById('js-motivation').addEventListener('click', function displayQuote() {
    fetch("https://api.quotable.io/random")
        .then(response => response.json())
        .then(data => {
            const quotetext = data.content;
            const author = data.author;
            var quoteContainer = document.getElementById('main-content');
            quoteContainer.style.opacity = 0;
                quoteContainer.style.display = 'block';


                var fadeInInterval = setInterval(function () {
                    if (quoteContainer.style.opacity < 1) {
                        quoteContainer.style.opacity = parseFloat(quoteContainer.style.opacity) + 0.1;
                    } else {
                        clearInterval(fadeInInterval);
                    }
                }, 50);
            // Displaying the quote and author
            const quoteElement = document.getElementById('quotes');
            const authorElement = document.getElementById('author');
            quoteElement.innerHTML = `"${quotetext}"`;
            authorElement.innerHTML= `-${author}`;

            // Add event listener for the copy button
            const copyButton = document.getElementById('copy-button');
            copyButton.addEventListener('click', function () {
                const fullQuote = `"${quotetext}" -${author}`;
                copyToClipboard(fullQuote);

                // Provide visual feedback (optional)
                copyButton.innerText = 'Copied!';
                setTimeout(function () {
                    copyButton.innerText = 'Copy';
                }, 1500);
            });
        })
        .catch(error => console.error('Error fetching quote:', error));
        

    const colorList = [
        '#ff7eb9', '#ff65a3', '#fff740', '#feff9c', '#ffa930' 
    ];

    function getRandomColor() {
        return colorList[Math.floor(Math.random() * colorList.length)];
    }

    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        const randomColor = getRandomColor();
        mainContent.style.backgroundColor = randomColor;
    }
});

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand('copy');

    document.body.removeChild(textarea);
}