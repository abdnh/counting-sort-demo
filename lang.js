const speedLabel = document.getElementById("speed-label");
const selectDataTypeLabel = document.getElementById("select-data-type");
const integerTypeLabel = document.getElementById("int-input-label");
const charTypeLabel = document.getElementById("char-input-label");
const canvasWidthLabel = document.getElementById("canvas-width-label");
const canvasHeightLabel = document.getElementById("canvas-height-label");
const langSelectLabel = document.getElementById("lang-select-label");
const langSelect = document.getElementById("lang-select");
const langSwitcher = document.getElementById("lang-switcher");

let currentLang = "en";

let langStrings = {
    "en": {
        name: "English",
        dir: "ltr",
        stepBack: "Step Back",
        stepForward: "Step Forward",
        resume: "Resume",
        pause: "Pause",
        play: "Play",
        animationSpeed: "Animation Speed",
        height: "Height",
        width: "Width",
        changeCanvasSize: "Change Canvas Size",
        selectDataType: "Select the type of data you want to sort:",
        integerType: "Integers (delimited by spaces)",
        charType: "A string of characters",
        langSelectLabel: "Switch Language:",
        langSwitcherFloat: "right",
        canvasHeightWarning: "Canvas is not high enough to draw all data - Adjust its height from the controls to the left",
        incrementCount: function (key) {
            return `incrementing count[${key}]`;
        },
        countingSortOffset: function (offset) {
            return `offset = ${offset}`;
        },
        countingSortRange: function (range) {
            return `range = ${range}`;
        },
        countingSortCalcPositions: function (key) {
            return `calculating positions of elements with key ${key}`;
        },
        countingSortStoringSorted: function (i, item, key, count) {
            return `storing element '${item}' with index ${i} and key ${key} at index ${count} of sorted array`;
        },
        countingSortDone: "Done!",

    },
    "ar": {
        name: "العربية",
        dir: "rtl",
        stepBack: "الرجوع بخطوة",
        stepForward: "التقدم بخطوة",
        resume: "استمرار",
        pause: "إيقاف",
        play: "تشغيل",
        animationSpeed: "سرعة العرض",
        height: "الارتفاع",
        width: "العرض",
        changeCanvasSize: "تغيير حجم مساحة الرسم",
        selectDataType: "حد نوع البيانات التي تريد ترتيبها:",
        integerType: "أعداد صحيحة (مفصولة بمسافات)",
        charType: "سلسلة حروف",
        langSelectLabel: "تغيير اللغة:",
        langSwitcherFloat: "left",
        canvasHeightWarning: "ارتفاع مساحة الرسم غير كافٍ لرسم كل البيانات - اضبط ارتفاعها من الخيارات على اليمين",
        incrementCount: function (key) {
            return `زيادة count[${key}] بواحد`;
        },
        countingSortOffset: function (offset) {
            return `أصغر مفتاح = ${offset}`;
        },
        countingSortRange: function (range) {
            return `النطاق = ${range}`;
        },
        countingSortCalcPositions: function (key) {
            return `حساب مواضع العناصر ذات المفتاح ${key}`;
        },
        countingSortStoringSorted: function (i, item, key, count) {
            return `تخزين العنصر '${item}' صاحب الفهرس ${i} والمفتاح ${key} في فهرس ${count} من المصفوفة المرتبة`;
        },
        countingSortDone: "تم!",
    }
}

function setLang(lang) {
    if (!langStrings.hasOwnProperty(lang)) return;
    currentLang = lang;
    let strings = langStrings[lang];
    document.documentElement.lang = lang;
    document.body.dir = strings.dir;
    stepBackButton.textContent = strings.stepBack;
    stepForwardButton.textContent = strings.stepForward;
    resumeButton.textContent = strings.resume;
    playButton.textContent = strings.play;
    canvasDimensionsButton.textContent = strings.changeCanvasSize;
    selectDataTypeLabel.textContent = strings.selectDataType;
    integerTypeLabel.textContent = strings.integerType;
    charTypeLabel.textContent = strings.charType;
    speedLabel.textContent = strings.animationSpeed;
    canvasWidthLabel.textContent = strings.width;
    canvasHeightLabel.textContent = strings.height;
    langSelectLabel.textContent = strings.langSelectLabel;
    langSwitcher.style.float = strings.langSwitcherFloat;
}

function getString(name) {
    let prop = langStrings[currentLang][name];
    if (typeof prop === "function") {
        return prop(...Array.from(arguments).slice(1));
    }
    else {
        return prop;
    }
}

function detectLang() {
    let params = (new URL(document.location)).searchParams;
    let paramLang = params.get("lang");
    if (paramLang) {
        setLang(paramLang);
    }
    else if (navigator.language.startsWith('ar')) {
        setLang("ar");
    }
}

function populateLangSelector() {
    for (let [lang, strings] of Object.entries(langStrings)) {
        let option = document.createElement("option");
        option.value = lang;
        option.textContent = strings.name;
        langSelect.appendChild(option);
        if (currentLang === lang) {
            option.selected = true;
        }
        option.addEventListener("click", () => {
            setLang(option.value);
        });
    }
}

detectLang();
populateLangSelector();
