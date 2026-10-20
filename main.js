(function(){
  /* Bindingsvælger på prissiden */
  var radios = document.querySelectorAll('input[name="binding"]');
  function currentTerm(){
    var c = document.querySelector('input[name="binding"]:checked');
    return c ? c.value : '36';
  }
  function updatePrices(){
    var t = currentTerm();
    document.querySelectorAll('.price[data-p' + t + ']').forEach(function(el){
      el.textContent = el.getAttribute('data-p' + t);
    });
    document.querySelectorAll('.term-months').forEach(function(el){ el.textContent = t; });
    document.querySelectorAll('.choose').forEach(function(a){
      a.setAttribute('href', '/kontakt?pakke=' + encodeURIComponent(a.getAttribute('data-plan')) + '&binding=' + t);
    });
  }
  if (radios.length){
    radios.forEach(function(r){ r.addEventListener('change', updatePrices); });
    updatePrices();
  }

  /* Kontaktformular */
  var form = document.getElementById('kontaktform');
  if (!form) return;

  var params = new URLSearchParams(window.location.search);
  var pakke = params.get('pakke'), binding = params.get('binding');
  if (['Start','Standard','Plus'].indexOf(pakke) !== -1) document.getElementById('pakke').value = pakke;
  if (['12','24','36'].indexOf(binding) !== -1) document.getElementById('bindingsperiode').value = binding + ' måneder';

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var knap = document.getElementById('sendknap');
    var tak = document.getElementById('tak'), fejl = document.getElementById('fejl');
    tak.hidden = true; fejl.hidden = true;
    knap.disabled = true; knap.textContent = 'Sender…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
      .then(function(res){
        if (res.ok) { form.reset(); tak.hidden = false; }
        else { fejl.hidden = false; }
      })
      .catch(function(){ fejl.hidden = false; })
      .then(function(){ knap.disabled = false; knap.textContent = 'Send forespørgsel'; });
  });
})();
