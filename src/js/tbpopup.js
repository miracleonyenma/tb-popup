const docStyles = document.documentElement.style;
const template = document.createElement('template');
template.innerHTML = `
    <style>
        :root{
            --active-stroke: #6a18ee;
            --stroke: #111;
        }

        .tooltip-cont, .tooltip-cont *{
            transition: 0.32s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .tooltip-cont, .svg-cont{
            display: inline-block;
            vertical-align: baseline;
            position: relative;
            z-index: 2;
        }

        .tooltip-btn{
            cursor: pointer;
        }

        .tooltip-btn__shape{
            fill: none;
            stroke: var(--stroke);
            stroke-miterlimit: 10;
            stroke-width: 3px;
        }

        .tooltip-btn__rect{
            x: 5;
            y: 10;
            width: 15px;
            height: 15px;
        }

        #tooltip-btn__arr{
            transform: translate(-2px, 2px)
        }
        
        .tooltip-btn:hover .tooltip-btn__shape, .tooltip-btn--active .tooltip-btn__shape{
            stroke: var(--active-stroke);
        }

        .tooltip-btn--active #tooltip-btn__arr{
            transform: translate(0px, 0px);
        }

        .svg-cont svg{
            width: 20px;
            height: 20px;
        }

        .tooltip-info{
            position: absolute;
            bottom: 40px;
            left: 20px;
            width: 300px;
            max-width: 80vw;
            background: rgba(255, 255, 255, 0.52);
            backdrop-filter: blur(10px);
            border: 3px solid var(--active-stroke);
            box-shadow: 15px 15px 25px rgba(0, 0, 0, 0.15);
            transform: scale(0);
            opacity: 0;
            transform-origin: bottom left;
        }

        .tooltip-info--active{
            transform: scale(1);
            opacity: 1;
        }

        .tooltip-info__text{
            padding: 12px calc(12px / 1.5);
            margin: 0;
            font-size: 16px;
        }
    </style>

    <div class="tooltip-cont">
        <div class="svg-cont tooltip-btn">
            <svg viewBox="0 0 28.48 28.48">
                <defs>
                    <style>
                        
                    </style>
                </defs>
                <g id="Layer_1-2" data-name="Layer 1">
                    <rect class="tooltip-btn__shape tooltip-btn__rect"/>
                    <polyline id="tooltip-btn__arr" class="tooltip-btn__shape" points="19.11 1.5 26.98 1.5 26.98 9.37" />
                </g>
            </svg>
        </div>

        <div class="tooltip-info">
            <p class="tooltip-info__text">
                <slot name="info" />
            </p>
        </div>
    </div>
`;

class TbPopup extends HTMLElement {
    constructor(){
        super();
        // create shadow root for TbPopup and returns it
        // set mode: 'open', to allow access via shadowRoot
        this.attachShadow({mode: 'open'});
        // attach template to shadowRoot
        // attaches template to shadowDOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(){
        const btn = this.shadowRoot.querySelector(".tooltip-btn");
        const infoCont = this.shadowRoot.querySelector(".tooltip-info");

        let tbpopup = this;
        if(tbpopup.getAttribute("stroke")){
            docStyles.setProperty("--stroke", tbpopup.getAttribute("stroke"));
        }

        if(tbpopup.getAttribute("active-stroke")){
            // setStyle(infoCont, "borderColor", tbpopup.getAttribute("active-stroke"));
            docStyles.setProperty("--active-stroke", tbpopup.getAttribute("active-stroke"));
        }
    
        btn.addEventListener("click", e => {
            infoCont.classList.toggle("tooltip-info--active");
            btn.classList.toggle("tooltip-btn--active");
            let btnStatus = checkClass(btn, "tooltip-btn--active");
            let infoStatus = checkClass(infoCont, "tooltip-info--active");
            console.log({btnStatus: btnStatus, infoStatus: infoStatus});
        })
    }
};

const checkClass = (target, value) => {
    return target.getAttribute("class").split(" ").includes(value);
};

const setStyle = (target, prop, val) => {
    target.style[prop] = val;
};

// add custom element 
window.customElements.define('tb-popup', TbPopup);