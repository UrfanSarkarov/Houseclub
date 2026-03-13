const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.querySelector('#year');
const analyzeButton = document.querySelector('#analyzePrices');
const sourceText = document.querySelector('#sourceText');
const priceResults = document.querySelector('#priceResults');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const toRaisedPrice = (originalValue) => {
  return (originalValue * 1.5).toFixed(2).replace(/\.00$/, '');
};

const extractPrices = (text) => {
  const matcher = /(?:\$\s?\d+(?:[.,]\d+)?|\d+(?:[.,]\d+)?\s?(?:₼|AZN|azn|\$))/g;
  return text.match(matcher) || [];
};

if (analyzeButton && sourceText && priceResults) {
  analyzeButton.addEventListener('click', () => {
    const input = sourceText.value.trim();

    if (!input) {
      priceResults.innerHTML = '<p>Please enter text to analyze.</p>';
      return;
    }

    const prices = extractPrices(input);

    if (!prices.length) {
      priceResults.innerHTML = '<p>No price-like values were found.</p>';
      return;
    }

    const outputItems = prices.map((priceToken) => {
      const numericValue = Number(priceToken.replace(/[^\d.,]/g, '').replace(',', '.'));
      const raisedValue = toRaisedPrice(numericValue);

      if (priceToken.includes('$')) {
        return `<li><strong>${priceToken}</strong> → <strong>$${raisedValue}</strong></li>`;
      }

      if (/azn/i.test(priceToken)) {
        return `<li><strong>${priceToken}</strong> → <strong>${raisedValue} AZN</strong></li>`;
      }

      return `<li><strong>${priceToken}</strong> → <strong>${raisedValue}₼</strong></li>`;
    });

    priceResults.innerHTML = `
      <p>Updated prices (+50%):</p>
      <ul>${outputItems.join('')}</ul>
    `;
  });
}
