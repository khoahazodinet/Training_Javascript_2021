
const billElementGlobal = document.querySelector('input[name=bill]');
const tipCustomElementGlobal =  document.querySelector('input[name=tipPercentCustom]');

const personCountElementGlobal = document.querySelector('input[name=personCount]');

billElementGlobal.addEventListener('blur', (event) => {
  checkPrice();
}, true);

tipCustomElementGlobal.addEventListener('blur', (event) => {
  checkPrice();
}, true);

personCountElementGlobal.addEventListener('blur', (event) => {
  checkPrice();
}, true);

function handleReset(){
  billElementGlobal.value = '';
  let tipElements =  document.getElementsByName('tipPercent');

  for(let i = 0; i < tipElements.length; i++) {
    if(tipElements[i].checked)
      tipElements[i].checked = false;
  }
  personCountElementGlobal.value = '';

  let amountResultElement = document.getElementById('amount-result');
  let totalResultElement = document.getElementById('total-result');

  amountResultElement.innerHTML = '';
  totalResultElement.innerHTML = '';

  const customTip = document.getElementById('custom-tip');
  customTip.classList.remove("onCustom");
}

function onTipPercentClick(){
  checkPrice();

}

function isCustomTip (){
  const customTip = document.getElementById('custom-tip');
  customTip.classList.add("onCustom");
}

function checkPrice(){

  // handle bill element
  let billElement = document.querySelector('input[name=bill]');
  let billErrorElement = document.getElementById('bill-error');

  if(billElement.value ===''){
    billErrorElement.innerHTML= 'Bill must be add';
    return;
  }
  document.getElementById('bill-error').innerHTML= '';

  // handle tip percent element
  let tipElements =  document.getElementsByName('tipPercent');
  let tipCustomElement =  document.querySelector('input[name=tipPercentCustom]');

  let tipNumber = 0;

  console.log(tipCustomElement.value);
  if(tipCustomElement.value===''){
    console.log(tipElements);

    for(let i = 0; i < tipElements.length; i++) {
      if(tipElements[i].checked)
        tipNumber= parseFloat(tipElements[i].value);
    }
  }else {
    tipNumber=tipCustomElement.value;
  }

  // handle count person element

  let personCountElement = document.querySelector('input[name=personCount]');
  let personCountErrorElement = document.getElementById('person-count-error');

  if(personCountElement.value ===''){
    personCountErrorElement.innerHTML= 'Number of people must be add';
    return;
  }
  document.getElementById('person-count-error').innerHTML= '';


  let amountResultElement = document.getElementById('amount-result');
  let totalResultElement = document.getElementById('total-result');

  let amountResult = (parseFloat(billElement.value) * (tipNumber) / 100) / 5;

  console.log(billElement.value, tipNumber, personCountElement.value, 'main');

  let totalResult = (
    (parseFloat(billElement.value) * tipNumber / 100)
    + parseFloat(billElement.value)
  )/5 ;

  amountResultElement.innerHTML = amountResult.toFixed(2).toString();
  totalResultElement.innerHTML = totalResult.toFixed(2).toString();

}