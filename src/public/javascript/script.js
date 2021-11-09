const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// big form
const formElement = $('#form-submit');

// form data
const billElementGlobal = formElement['bill'];
const tipElementsGlobal =  formElement['tipPercent'];
const tipCustomElementGlobal = formElement['tipPercentCustom'];
const personCountElementGlobal = formElement['personCount'];

// error
const billErrorElement = $('#bill-error');
const personCountErrorElement = $('#person-count-error');

// custom box
const tipCustomBoxElementGlobal =  $('#custom-tip');

// result
const amountResultElementGlobal = $('#amount-result');
const totalResultElementGlobal = $('#total-result');

// submit button
const submitBtnElement = $('#submit-button');

// reset button
const resetBtnElement = $('#reset-button');

let throttleTimer;

const app = {
  bill: 0,
  tipNumber: 0,
  tipNumberCustom: '',
  percentCount: 0,
  amountResult: '00.00',
  totalResult: '00.00',
  isResetDisabled: false,
  isSubmitDisabled: false,
  timerId: true,
  isFetchDone: true,

  showSubmitBtn: function(){
    submitBtnElement.disabled = false;
    submitBtnElement.classList.remove('btn-disabled');
  },
  hindSubmitBtn: function(){
    submitBtnElement.disabled = true;
    submitBtnElement.classList.add('btn-disabled');
  },

  onTipPercentClick: function(){
    this.tipNumber = '';
    tipCustomElementGlobal.value = '';
    tipCustomBoxElementGlobal.classList.remove("onCustom");
  },

  isCustomTip: function(){
    tipCustomBoxElementGlobal.classList.add("onCustom");
  },

  handleReset: function(){
    // bill remove
    billElementGlobal.value = 0;

    // bill error remove
    billErrorElement.innerHTML= '';

    // tip remove
    for(let i = 0; i < tipElementsGlobal.length; i++) {
      if(tipElementsGlobal[i].checked)
        tipElementsGlobal[i].checked = false;
    }

    // tip custom remove
    tipCustomElementGlobal.classList.remove("onCustom");
    tipCustomElementGlobal.value= '';

    // tip custom error remove
    personCountErrorElement.innerHTML= '';

    // person count remove
    personCountElementGlobal.value = 0;

    //result remove
    amountResultElementGlobal.innerHTML = '00.00';
    totalResultElementGlobal.innerHTML = '00.00';

    // disable reset button
    this.isResetDisabled = true;
    resetBtnElement.disabled = true;
    resetBtnElement.classList.add('btn-disabled');
  },

  handleResetAvailable: function (){
    this.bill = parseFloat(billElementGlobal.value);
    this.percentCount = parseFloat(personCountElementGlobal.value);

    if (this.bill === 0 && this.percentCount === 0){
      this.isResetDisabled = true;
      resetBtnElement.disabled = true;
      resetBtnElement.classList.add('btn-disabled');
    }else {
      this.isResetDisabled = false;
      resetBtnElement.disabled = false;
      resetBtnElement.classList.remove('btn-disabled');
    }
  },

  // declare  let throttleTimer;
  throttle: function ( delay){
    if(throttleTimer)
      return;
    throttleTimer=true;

    // get data from server
    this.fetchData();
    setTimeout(()=>{
      throttleTimer=false;
    }, delay)
  },

  onsubmit: function (){
    this.hindSubmitBtn();
    if(this.validate()===true){
      this.throttle(100);
    }else {
      this.showSubmitBtn();
    }
  },

  validate: function (){
    // handle bill element
    if(billElementGlobal.value ===''){
      billErrorElement.innerHTML= 'Bill must be add';
      return false;
    }
    if(billElementGlobal.value<=0){
      billErrorElement.innerHTML= 'Bill must be greater than 0';
      return false;
    }
    this.bill = parseFloat(billElementGlobal.value);
    billErrorElement.innerHTML= '';

    // handle tip percent element
    if(tipCustomElementGlobal.value=== ''){
      for(let i = 0; i < tipElementsGlobal.length; i++) {
        if(tipElementsGlobal[i].checked)
          this.tipNumber= parseFloat(tipElementsGlobal[i].value);
      }
    }else {
      this.tipNumber= parseFloat(tipCustomElementGlobal.value);
    }

    // handle count person element

    if(personCountElementGlobal.value === '0'){
      personCountErrorElement.innerHTML= 'Number of people must be add';
      return false;
    }
    if(personCountElementGlobal.value <= 0){
      personCountErrorElement.innerHTML= 'Number of people must be greater than 0';
      return false;
    }

    this.percentCount = parseFloat(personCountElementGlobal.value);
    personCountErrorElement.innerHTML= '';

    amountResultElementGlobal.innerHTML = '--.--';
    totalResultElementGlobal.innerHTML = '--.--';
    return true;
  },

  fetchData: function (){

    // disable button when fetch data
    this.isResetDisabled = true;
    resetBtnElement.disabled = true;
    resetBtnElement.classList.add('btn-disabled');

    const url = 'https://plitter-server.vercel.app/api/calculate?' +
      `bill=${this.bill}&people=${this.percentCount}&tipPercent=${this.tipNumber}`;

    this.getData(url
    ).then(res=>{
      if(res['result']===true){
        this.amountResult = res['amount'];
        this.totalResult = res['total'];
        amountResultElementGlobal.innerHTML = this.amountResult.toFixed(2).toString();
        totalResultElementGlobal.innerHTML = this.totalResult.toFixed(2).toString();
      }
      // available button when done
      this.isResetDisabled = false;
      resetBtnElement.disabled = false;
      resetBtnElement.classList.remove('btn-disabled');
      this.showSubmitBtn();
    }).catch(req=>{
      // available button when done
      this.isResetDisabled = false;
      resetBtnElement.disabled = false;
      resetBtnElement.classList.remove('btn-disabled');
      this.showSubmitBtn();
    })
  },

  getData: async function (url) {
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        // 'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade,
      // origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // params: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  },

  postData: async function (url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin,
      // same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  },

  checkPrice: function (){
    // console.log('on blur form');
  },

  start: function () {

    formElement.addEventListener('blur', (event) => {
      this.checkPrice();
    }, true);

    billElementGlobal.addEventListener('focus', () => {
      if(billElementGlobal.value=== '0'){
        billElementGlobal.value='';
      }
    });
    billElementGlobal.addEventListener('blur', () => {
      if(billElementGlobal.value=== ''){
        billElementGlobal.value='0';
      }
    });
    personCountElementGlobal.addEventListener('focus', () => {
      if(personCountElementGlobal.value=== '0'){
        personCountElementGlobal.value='';
      }
    });
    personCountElementGlobal.addEventListener('blur', () => {
      if(personCountElementGlobal.value=== ''){
        personCountElementGlobal.value='0';
      }
    });
    billElementGlobal.addEventListener('change', (event) => {
      this.handleResetAvailable();
    });
    personCountElementGlobal.addEventListener('change', (event) => {
      this.handleResetAvailable();
    });
  },
}

app.start();
