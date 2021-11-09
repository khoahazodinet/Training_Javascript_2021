const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// bill
const billElementGlobal = $('input[name=bill]');
const billErrorElement = $('#bill-error');

const tipElementsGlobal =  $$('input[name=tipPercent]');

// tip custom
const tipCustomBoxElementGlobal =  $('#custom-tip');
const tipCustomElementGlobal =  $('input[name=tipPercentCustom]');

// person count
const personCountElementGlobal = $('input[name=personCount]');
const personCountErrorElement = $('#person-count-error');

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
  timerId: true,

  onTipPercentClick: function(){
    this.tipNumber = '';
    tipCustomElementGlobal.value = '';
    tipCustomBoxElementGlobal.classList.remove("onCustom");
  },

  isCustomTip: function(){
    console.log('custom tip');
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

  throttle: function ( delay){
    console.log('in');
    if(throttleTimer)
      return;
    throttleTimer=true;
    this.fetchData();
    setTimeout(()=>{
      throttleTimer=false;
      this.isResetDisabled = false;
      submitBtnElement.disabled = false;
      submitBtnElement.classList.remove('btn-disabled');
    }, delay)
  },

  onsubmit: function (){
    this.isResetDisabled = true;
    submitBtnElement.disabled = true;
    submitBtnElement.classList.add('btn-disabled');
    this.throttle(1000);
  },

  fetchData: function (){
    console.log('onsubmit');

    // handle bill element
    if(billElementGlobal.value ===''){
      billErrorElement.innerHTML= 'Bill must be add';
      return;
    }
    if(billElementGlobal.value<=0){
      billErrorElement.innerHTML= 'Bill must be greater than 0';
      return;
    }
    this.bill = parseFloat(billElementGlobal.value);
    billErrorElement.innerHTML= '';

    // handle tip percent element
    console.log(tipCustomElementGlobal.value);
    if(tipCustomElementGlobal.value=== ''){
      console.log(tipElementsGlobal);

      for(let i = 0; i < tipElementsGlobal.length; i++) {
        if(tipElementsGlobal[i].checked)
          this.tipNumber= parseFloat(tipElementsGlobal[i].value);
      }
    }else {
      this.tipNumber= parseFloat(tipCustomElementGlobal.value);
    }

    // disable button when fetch data
    this.isResetDisabled = true;
    resetBtnElement.disabled = true;
    resetBtnElement.classList.add('btn-disabled');

    // handle count person element

    if(personCountElementGlobal.value === '0'){
      personCountErrorElement.innerHTML= 'Number of people must be add';
      return;
    }
    if(personCountElementGlobal.value <= 0){
      personCountErrorElement.innerHTML= 'Number of people must be greater than 0';
      return;
    }

    this.percentCount = parseFloat(personCountElementGlobal.value);
    personCountErrorElement.innerHTML= '';

    amountResultElementGlobal.innerHTML = '--.--';
    totalResultElementGlobal.innerHTML = '--.--';
    const url = 'https://plitter-server.vercel.app/api/calculate?' +
      `bill=${this.bill}&people=${this.percentCount}&tipPercent=${this.tipNumber}`

    console.log(url);
    this.getData(url
    ).then(res=>{
      console.log(res);
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
    }).catch(req=>{
      // available button when done
      this.isResetDisabled = false;
      resetBtnElement.disabled = false;
      resetBtnElement.classList.remove('btn-disabled');
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
    // console.log('out blur');
  },

  // checkPrice :function (){
  //
  //   // handle bill element
  //   if(billElementGlobal.value ===''){
  //     billErrorElement.innerHTML= 'Bill must be add';
  //     return;
  //   }
  //   if(billElementGlobal.value<=0){
  //     billErrorElement.innerHTML= 'Bill must be greater than';
  //     return;
  //   }
  //   this.bill = parseFloat(billElementGlobal.value);
  //   billErrorElement.innerHTML= '';
  //
  //   // handle tip percent element
  //
  //   console.log(tipCustomElementGlobal.value);
  //   if(tipCustomElementGlobal.value=== ''){
  //     console.log(tipElementsGlobal);
  //
  //     for(let i = 0; i < tipElementsGlobal.length; i++) {
  //       if(tipElementsGlobal[i].checked)
  //         this.tipNumber= parseFloat(tipElementsGlobal[i].value);
  //     }
  //   }else {
  //     this.tipNumber= parseFloat(tipCustomElementGlobal.value);
  //   }
  //
  //   // handle count person element
  //
  //   if(personCountElementGlobal.value === '0'){
  //     personCountErrorElement.innerHTML= 'Number of people must be add';
  //     return;
  //   }
  //   if(personCountElementGlobal.value <= 0){
  //     personCountErrorElement.innerHTML= 'Number of people must be greater than 0';
  //     return;
  //   }
  //
  //   this.percentCount = parseFloat(personCountElementGlobal.value);
  //   personCountErrorElement.innerHTML= '';
  //
  //   // calculate result
  //   this.amountResult = (
  //     this.bill * this.tipNumber / 100
  //   ) / this.percentCount;
  //   this.totalResult = (
  //     (this.bill * this.tipNumber / 100) + this.bill
  //   ) / this.percentCount;
  //
  //   // show result
  //   amountResultElementGlobal.innerHTML = this.amountResult.toFixed(2).toString();
  //   totalResultElementGlobal.innerHTML = this.totalResult.toFixed(2).toString();
  //
  // },

  start: function () {
    billElementGlobal.addEventListener('blur', (event) => {
      this.checkPrice();
    }, true);
    tipCustomElementGlobal.addEventListener('blur', (event) => {
      this.checkPrice();
    }, true);
    personCountElementGlobal.addEventListener('blur', (event) => {
      this.checkPrice();
    }, true);
    billElementGlobal.addEventListener('change', (event) => {
      this.handleResetAvailable();
    });
    personCountElementGlobal.addEventListener('change', (event) => {
      this.handleResetAvailable();
    });
  },
}

app.start();
