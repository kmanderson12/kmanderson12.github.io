const PLAN_TYPES = {
  PHOTO: 'Photo',
  VIDEO: 'Video',
};

const PLAN_TERMS = {
  MONTHLY: {
    id: 'MONTHLY',
    termsText: 'month',
    subFrequency: '1m',
  },
  ANNUAL: {
    id: 'ANNUAL',
    termsText: 'year',
    subFrequency: '1y',
  },
};

const PLAN_COMMITMENT = {
  MONTHLY: 'MONTHLY',
  ANNUAL: 'ANNUAL',
};

const DM_PLANS = {
  PHOTO_ONLY: {
    displayName: 'Photo',
    code: 'PHOTO_ONLY',
  },
  VIDEO_ONLY: {
    displayName: 'Video',
    code: 'VIDEO_ONLY',
  },
  PHOTO_AND_VIDEO: {
    displayName: 'Photo and Video',
    code: 'PHOTO_AND_VIDEO',
  },
};

let roundOff = (num, places) => {
  const x = Math.pow(10, places);
  return Math.round(num * x) / x;
};

document.addEventListener('alpine:init', () => {
  Alpine.store('cart', {
    items: [],
    total: 0,
    baseTotal: 0,
    annualTotal: 0,
    terms: PLAN_TERMS.MONTHLY,
    monthlyURL: '',
    annualURL: '',
    toggleAddOns(parentCode) {
      let parentExists = this.items.some((item) => item.code === parentCode);
      let addOns = Array.from(
        document.querySelectorAll(`.add-on-for-${parentCode}`)
      );
      let addOnHeading = Array.from(
        document.querySelectorAll(`.add-on_heading-for-${parentCode}`)
      );

      addOns.map((item) => {
        parentExists
          ? (item.style.display = 'flex')
          : (item.style.display = 'none');
      });

      addOnHeading.map((item) => {
        parentExists ? (item.style.opacity = '1') : (item.style.opacity = '0');
      });
    },
    toggleOtherAddOns() {
      let itemsExist = this.items.length > 0;
      let otherAddOns = this.items.filter(
        (i) => i.parentCode === 'dm-general'
      ).length;

      let addOns = Array.from(
        document.querySelectorAll(`.other-add-on_option`)
      );
      let addOnHeading = Array.from(
        document.querySelectorAll(`.other-add-on_heading`)
      );

      addOns.map((item) => {
        itemsExist
          ? (item.style.display = 'flex')
          : (item.style.display = 'none');
      });

      addOnHeading.map((item) => {
        if (itemsExist) {
          item.style.opacity = '1';
          item.style.display = 'block';
        } else {
          item.style.opacity = '0';
          item.style.display = 'none';
        }
      });

      if (this.items.length === otherAddOns) {
        this.items = [];
        this.total = 0;
        let selectedOptions = document.querySelectorAll('.option-selected');
        selectedOptions.forEach((el) => el.classList.remove('option-selected'));
        addOns.map((item) => {
          item.style.display = 'none';
        });

        addOnHeading.map((item) => {
          item.style.opacity = '0';
          item.style.display = 'none';
        });
      }
    },
    setTotal() {
      this.setBaseTotal();
      this.setMonthlyTotal();
      this.setAnnualTotal();
    },
    setBaseTotal() {
      let newTotal = 0;
      this.items.map((i) => (newTotal = newTotal + parseInt(i.price)));

      // bundle pricing
      if (this.getMonthlyPlan() == DM_PLANS.PHOTO_AND_VIDEO) {
        newTotal = newTotal * 0.9; // 10% off
      }

      this.baseTotal = roundOff(newTotal, 0);
    },
    setMonthlyTotal() {
      const $planTotalEl = document.getElementById('PlanTotal-Monthly');
      $planTotalEl.innerText = this.baseTotal.toLocaleString('en-US');

      this.setMonthlyURL();
    },
    setAnnualTotal() {
      // calculate annual discount
      this.annualTotal = roundOff(this.baseTotal * 0.8, 0); // 20% off

      const $planTotalEl = document.getElementById('PlanTotal-Annual');
      $planTotalEl.innerText = this.annualTotal.toLocaleString('en-US');

      this.setAnnualURL();
    },
    toggleItem(e) {
      let currentItem = e.target.dataset;
      let isItemPackage = currentItem.parentCode === '';
      const filtered = this.items.filter(
        (item) => item.code === currentItem.code
      );
      const itemExists = this.items.some(
        (item) => item.code === currentItem.code
      );
      const el = document.querySelector(`[data-option='${currentItem.code}']`);
      el.setAttribute(
        'data-selected',
        currentItem.selected === 'true' ? 'false' : 'true'
      );
      if (itemExists) {
        // if item exists, remove it (toggle off)
        let index = this.items.findIndex((i) => i.code === currentItem.code);
        this.items.splice(index, 1);
        //this.total = this.total - parseInt(currentItem.price);
        if (isItemPackage) {
          e.target.classList.remove('plan-add-btn_selected');
          e.target.innerText = 'ADD';

          // TODO: Remove all items where currentItem.code = item.parentCode;
          let newItemList = this.items.filter(
            (i) => i.parentCode != currentItem.code
          );
          this.items = newItemList;
          let optionSquares = document.querySelectorAll(
            `[data-parent-code='${currentItem.code}'`
          );

          optionSquares.forEach((square) =>
            square.classList.remove('option-selected')
          );
        } else {
          let optionSquare = document.getElementById(
            `option-${currentItem.code}`
          );
          optionSquare.classList.remove('option-selected');
        }
      } else {
        this.items.push(currentItem);

        if (isItemPackage) {
          e.target.classList.add('plan-add-btn_selected');
          e.target.innerText = 'ADDED!';
        } else {
          let optionSquare = document.getElementById(
            'option-' + currentItem.code
          );
          optionSquare.classList.add('option-selected');
        }
      }
      // show/hide AddOns
      this.toggleAddOns(currentItem.code);
      this.toggleOtherAddOns();
      // update total
      this.setTotal();
    },
    getMonthlyPlan() {
      if (
        this.items.filter((i) => i.name === PLAN_TYPES.PHOTO).length > 0 &&
        this.items.filter((i) => i.name === PLAN_TYPES.VIDEO).length > 0
      ) {
        return DM_PLANS.PHOTO_AND_VIDEO;
      }
      if (
        this.items.filter((i) => i.name === PLAN_TYPES.PHOTO).length > 0 &&
        this.items.filter((i) => i.name === PLAN_TYPES.VIDEO).length === 0
      ) {
        return DM_PLANS.PHOTO_ONLY;
      }
      if (
        this.items.filter((i) => i.name === PLAN_TYPES.PHOTO).length === 0 &&
        this.items.filter((i) => i.name === PLAN_TYPES.VIDEO).length > 0
      ) {
        return DM_PLANS.VIDEO_ONLY;
      } else {
        return null;
      }
    },
    addItems(array) {
      array.forEach((i) => {
        let el = document.querySelector(`[data-code='${i}`);
        el.click();
      });
    },
    clearItems() {
      this.items = [];
      this.total = 0;

      let elements = document.querySelectorAll("[data-selected='true']");
      elements.forEach((e) => {
        // clear all classes and fix text
        let planButtons = document.querySelectorAll("[id^='Plan-'");
        planButtons.forEach((btn) => {
          btn.classList.remove('plan-add-btn_selected');
          btn.innerText = 'ADD';
        });
      });

      // clear all options
      let selectedOptions = document.querySelectorAll('.option-selected');
      selectedOptions.forEach((el) => el.classList.remove('option-selected'));

      // update total and url
      this.setTotal();
    },
    buildURL(planCommitment) {
      if (
        planCommitment !== PLAN_COMMITMENT.ANNUAL &&
        planCommitment !== PLAN_COMMITMENT.MONTHLY
      ) {
        console.error('Invalid plan commitment.');
        return '';
      }
      const foxyURL = new URL(
        'https://orders.fifthandbroad.com/cart?empty=true'
      );
      let currentPlan = this.getMonthlyPlan();
      if (currentPlan === null) return foxyURL;

      let planName =
        planCommitment === PLAN_COMMITMENT.ANNUAL
          ? `${currentPlan.displayName} - Annual Commitment`
          : `${currentPlan.displayName} - Month to Month`;

      foxyURL.searchParams.append('name', planName);
      foxyURL.searchParams.append('code', currentPlan.code);
      foxyURL.searchParams.append('sub_frequency', '1m');
      foxyURL.searchParams.append(
        'price',
        planCommitment === PLAN_COMMITMENT.ANNUAL
          ? this.annualTotal
          : this.baseTotal
      );
      foxyURL.searchParams.append('quantity_max', 1);

      // Build AddOns
      let photoAddOns = '';
      let videoAddOns = '';
      let itemCodes = [];
      this.items.map((item) => {
        itemCodes.push(item.code);
        if (item.parentCode === 'dm-photo') {
          photoAddOns === ''
            ? (photoAddOns += item.name)
            : (photoAddOns += `, ${item.name}`);
        }
        if (item.parentCode === 'dm-video') {
          videoAddOns === ''
            ? (videoAddOns += item.name)
            : (videoAddOns += `, ${item.name}`);
        }
      });

      // photo add ons
      if (
        currentPlan === DM_PLANS.PHOTO_ONLY ||
        currentPlan === DM_PLANS.PHOTO_AND_VIDEO
      ) {
        foxyURL.searchParams.append('Photo_Add_Ons', photoAddOns);
      }

      // video add ons
      if (
        currentPlan === DM_PLANS.VIDEO_ONLY ||
        currentPlan === DM_PLANS.PHOTO_AND_VIDEO
      ) {
        foxyURL.searchParams.append('Video_Add_Ons', videoAddOns);
      }

      // all item codes
      foxyURL.searchParams.append('Item_Codes', itemCodes.join(','));

      // set commitment
      foxyURL.searchParams.append('Plan_Terms', planCommitment);

      return foxyURL;
    },
    setMonthlyURL() {
      // update URL
      const $purchaseBtnEl = document.getElementById('PurchaseBtn-Monthly');
      const newURL = this.buildURL(PLAN_COMMITMENT.MONTHLY);
      $purchaseBtnEl.href = newURL;
    },
    setAnnualURL() {
      // update URL
      const $purchaseBtnEl = document.getElementById('PurchaseBtn-Annual');
      const newURL = this.buildURL(PLAN_COMMITMENT.ANNUAL);
      $purchaseBtnEl.href = newURL;
    },
  });
});
