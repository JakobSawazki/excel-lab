(function () {
  "use strict";
  // Independent demo: never reads or changes profiles, progress or lesson answers.
  const quantity = document.querySelector("#lab-quantity");
  if (!quantity) return;
  const reset = document.querySelector("#lab-reset");
  const currency = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
  let announcement;
  function update(announce = true) {
    const count = Number(quantity.value);
    const total = currency.format(count * 2.5);
    const units = count === 1 ? "1 Heft" : `${count} Hefte`;
    document.querySelector("#lab-quantity-label").textContent = units;
    quantity.setAttribute("aria-valuetext", units);
    document.querySelector("#lab-cell-quantity").textContent = count;
    document.querySelector("#lab-cell-total").textContent = total;
    document.querySelector("#lab-total").textContent = total;
    document.querySelector("#lab-meter").style.setProperty("--lab-fill", `${count * 5}%`);
    document.querySelector("#lab-explanation").textContent = `2,50 € × ${units} = ${total}`;
    clearTimeout(announcement);
    if (announce) announcement = setTimeout(() => {
      document.querySelector("#lab-announcement").textContent = `${units} kosten ${total}. Die Formel bleibt gleich: B2 mal C2.`;
    }, 250);
  }
  quantity.disabled = false; reset.disabled = false;
  quantity.addEventListener("input", () => update());
  reset.addEventListener("click", () => { quantity.value = "6"; update(); });
  update(false);
})();
