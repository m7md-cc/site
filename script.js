document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PAGE NAVIGATION
    ===================================================== */

    const pages = [
        ...document.querySelectorAll(".page")
    ];

    const nextButtons = [
        ...document.querySelectorAll(".next")
    ];

    const nextButton =
        document.getElementById("next");

    const prevButton =
        document.getElementById("prev");

    const dots = [
        ...document.querySelectorAll(".dot")
    ];


    let currentPage = 0;

    let isAnimating = false;



    /* =====================================================
       UPDATE NAVIGATION
    ===================================================== */

    function updateNavigation(){

        prevButton.disabled =
            currentPage === 0;

        nextButton.disabled =
            currentPage === pages.length - 1;


        dots.forEach((dot,index)=>{

            dot.classList.toggle(
                "active",
                index === currentPage
            );

        });

    }



    /* =====================================================
       GO TO PAGE
    ===================================================== */

    function goToPage(
        newPage,
        direction = 1
    ){

        if(isAnimating)
            return;


        if(
            newPage < 0 ||
            newPage >= pages.length ||
            newPage === currentPage
        ){
            return;
        }


        isAnimating = true;


        const oldPage =
            pages[currentPage];

        const newPageElement =
            pages[newPage];


        /*
            تجهيز الصفحة الجديدة
        */

        newPageElement.style.transition =
            "none";

        newPageElement.style.visibility =
            "visible";

        newPageElement.style.opacity =
            "0";


        newPageElement.style.transform =
            direction > 0

                ? "translateX(50px) scale(.985)"

                : "translateX(-50px) scale(.985)";


        /*
            إخفاء الصفحة القديمة
        */

        oldPage.classList.remove(
            "active"
        );


        /*
            تشغيل الأنيميشن
        */

        requestAnimationFrame(()=>{

            requestAnimationFrame(()=>{

                newPageElement.style.transition =
                    "";

                newPageElement.style.opacity =
                    "1";

                newPageElement.style.transform =
                    "translateX(0) scale(1)";

                newPageElement.classList.add(
                    "active"
                );

            });

        });


        currentPage =
            newPage;


        updateNavigation();


        /*
            تنظيف
        */

        setTimeout(()=>{

            pages.forEach((page,index)=>{

                if(index !== currentPage){

                    page.classList.remove(
                        "active"
                    );

                    page.style.cssText =
                        "";

                }

            });


            newPageElement.style.cssText =
                "";

            isAnimating = false;

        },700);

    }



    /* =====================================================
       NEXT / PREVIOUS
    ===================================================== */

    function nextPage(){

        if(
            currentPage <
            pages.length - 1
        ){

            goToPage(
                currentPage + 1,
                1
            );

        }

    }


    function previousPage(){

        if(currentPage > 0){

            goToPage(
                currentPage - 1,
                -1
            );

        }

    }



    /* =====================================================
       BUTTONS
    ===================================================== */

    nextButtons.forEach(button => {

        button.addEventListener(
            "click",
            nextPage
        );

    });


    nextButton.addEventListener(
        "click",
        nextPage
    );


    prevButton.addEventListener(
        "click",
        previousPage
    );



    /* =====================================================
       DOTS
    ===================================================== */

    dots.forEach(dot => {

        dot.addEventListener(
            "click",
            () => {

                const target =
                    Number(
                        dot.dataset.i
                    );


                if(target > currentPage){

                    goToPage(
                        target,
                        1
                    );

                }

                else if(
                    target < currentPage
                ){

                    goToPage(
                        target,
                        -1
                    );

                }

            }
        );

    });



    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if(event.key === "ArrowLeft"){

                nextPage();

            }


            if(event.key === "ArrowRight"){

                previousPage();

            }

        }
    );



    /* =====================================================
       TOUCH SWIPE
    ===================================================== */

    let startX = 0;

    let startY = 0;


    document.addEventListener(
        "touchstart",
        event => {

            const touch =
                event.changedTouches[0];


            startX =
                touch.screenX;

            startY =
                touch.screenY;

        },
        {
            passive:true
        }
    );


    document.addEventListener(
        "touchend",
        event => {

            const touch =
                event.changedTouches[0];


            const differenceX =
                touch.screenX - startX;


            const differenceY =
                touch.screenY - startY;


            /*
                تجاهل الحركة الرأسية
            */

            if(
                Math.abs(differenceX) < 60 ||
                Math.abs(differenceX) <
                Math.abs(differenceY)
            ){

                return;

            }


            /*
                سحب للشمال
                = الصفحة التالية
            */

            if(differenceX < 0){

                nextPage();

            }


            /*
                سحب لليمين
                = الصفحة السابقة
            */

            else{

                previousPage();

            }

        },
        {
            passive:true
        }
    );



    /* =====================================================
       INITIAL NAVIGATION
    ===================================================== */

    updateNavigation();



    /* =====================================================
       MUSIC PLAYER
    ===================================================== */

    const music =
        document.getElementById("music");


    const musicButton =
        document.getElementById("musicBtn");


    const musicWidget =
        document.getElementById(
            "musicWidget"
        );


    const progress =
        document.getElementById(
            "progress"
        );


    const musicStatus =
        document.getElementById(
            "musicStatus"
        );


    const time =
        document.getElementById(
            "time"
        );



    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatTime(seconds){

        if(
            !Number.isFinite(seconds)
        ){

            return "0:00";

        }


        const minutes =
            Math.floor(
                seconds / 60
            );


        const remainingSeconds =
            Math.floor(
                seconds % 60
            );


        return (
            minutes +
            ":" +
            String(
                remainingSeconds
            ).padStart(2,"0")
        );

    }



    /* =====================================================
       MUSIC UI
    ===================================================== */

    function updateMusicUI(
        isPlaying
    ){

        musicWidget.classList.toggle(
            "playing",
            isPlaying
        );


        if(isPlaying){

            musicStatus.textContent =
                "بتشتغل دلوقتي...";

        }

        else{

            musicStatus.textContent =
                "اضغط للتشغيل";

        }

    }



    /* =====================================================
       PLAY MUSIC
    ===================================================== */

    async function playMusic(){

        try{

            await music.play();

            updateMusicUI(true);

        }

        catch(error){

            updateMusicUI(false);

            musicStatus.textContent =
                "اضغط ▶ للتشغيل";

        }

    }



    /* =====================================================
       PLAY / PAUSE
    ===================================================== */

    musicButton.addEventListener(
        "click",
        () => {

            if(music.paused){

                playMusic();

            }

            else{

                music.pause();

                updateMusicUI(false);

            }

        }
    );



    /* =====================================================
       AUDIO EVENTS
    ===================================================== */

    music.addEventListener(
        "loadedmetadata",
        () => {

            time.textContent =
                formatTime(
                    music.duration
                );

        }
    );


    music.addEventListener(
        "timeupdate",
        () => {

            if(!music.duration)
                return;


            const percentage =
                (
                    music.currentTime /
                    music.duration
                ) * 100;


            progress.value =
                percentage;


            time.textContent =
                formatTime(
                    music.currentTime
                );

        }
    );


    music.addEventListener(
        "play",
        () => {

            updateMusicUI(true);

        }
    );


    music.addEventListener(
        "pause",
        () => {

            updateMusicUI(false);

        }
    );



    /* =====================================================
       PROGRESS BAR
    ===================================================== */

    progress.addEventListener(
        "input",
        () => {

            if(!music.duration)
                return;


            music.currentTime =
                (
                    progress.value /
                    100
                ) *
                music.duration;

        }
    );



    /* =====================================================
       MUSIC AUTOPLAY
    ===================================================== */

    /*
        نحاول تشغيل الأغنية
        عند فتح الموقع.

        لو المتصفح منع autoplay،
        زر التشغيل يظل جاهزًا.
    */

    playMusic();

});
