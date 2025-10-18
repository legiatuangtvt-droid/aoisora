(function(){
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const close = document.getElementById('close');
    const ok = document.getElementById('ok');
    function openModal(name){
      title.textContent = 'Feature under development';
      body.textContent = (name || 'This') + ': This feature is under development. Please check back later.';
      modal.setAttribute('aria-hidden','false');
    }
    function hide(){ modal.setAttribute('aria-hidden','true') }

    // POP for tiles without links
    document.querySelectorAll('.tile.pop').forEach(t => {
      t.addEventListener('click', () => openModal(t.dataset.name));
      t.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openModal(t.dataset.name); }
      });
    });
    [close, ok, modal].forEach(el => el.addEventListener('click', (e)=>{
      if(e.target === el) hide();
    }));
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') hide() });

    // Strong pulse only when clicking Training
    const trainingTile = document.getElementById('training-tile');
    const trainingBadge = document.getElementById('training-badge');
    if (trainingTile) {
      trainingTile.addEventListener('click', () => {
        trainingTile.classList.remove('pulse-active');
        trainingBadge.classList.remove('burst');
        // force reflow to restart animation
        void trainingTile.offsetWidth;
        void trainingBadge.offsetWidth;
        trainingTile.classList.add('pulse-active');
        trainingBadge.classList.add('burst');
      });
      trainingTile.addEventListener('animationend', () => trainingTile.classList.remove('pulse-active'));
    }
  })();