/* ══════════════════════════════════════
   main.js — Oregon Landscape
   Interactions & scroll reveals
══════════════════════════════════════ */

// ── Footer year ──
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Header is always solid white — no scroll state needed

// ── Mobile nav ──
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Smooth scroll for in-page links ──
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (href === '#' || href.length < 2) return;
  const target = document.querySelector(href);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// ── Testimonials carousel ──
const testTrack = document.getElementById('testTrack');
const testPrev = document.getElementById('testPrev');
const testNext = document.getElementById('testNext');
if (testTrack && testPrev && testNext) {
  const getStep = () => {
    const card = testTrack.querySelector('.testimonial');
    if (!card) return testTrack.clientWidth;
    const styles = getComputedStyle(testTrack);
    const gap = parseFloat(styles.columnGap || styles.gap || 0);
    return card.offsetWidth + gap;
  };
  const update = () => {
    const max = testTrack.scrollWidth - testTrack.clientWidth - 2;
    testPrev.disabled = testTrack.scrollLeft <= 2;
    testNext.disabled = testTrack.scrollLeft >= max;
  };
  testPrev.addEventListener('click', () => {
    testTrack.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });
  testNext.addEventListener('click', () => {
    testTrack.scrollBy({ left: getStep(), behavior: 'smooth' });
  });
  testTrack.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// ── Ensure hero video plays (mobile Safari quirks) ──
const heroVideo = document.querySelector('.hero__video');
if (heroVideo) {
  const tryPlay = () => heroVideo.play().catch(() => {});
  tryPlay();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });
}

// ── Receptionist Chat ──
(function () {
  const BTN_HTML = `
<button class="rx-btn" id="rxBtn" aria-label="Chat with us">
  <span class="rx-btn__badge"></span>
  <span class="rx-btn__icon">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  </span>
  Ask Us Anything
</button>`;

  const WIN_HTML = `
<div class="rx-window" id="rxWindow" role="dialog" aria-label="Chat with Oregon Landscape">
  <div class="rx-head">
    <div class="rx-head__avatar">🌿</div>
    <div class="rx-head__info">
      <div class="rx-head__name">Oregon Landscape</div>
      <div class="rx-head__status">Online now</div>
    </div>
    <button class="rx-head__close" id="rxClose" aria-label="Close chat">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="rx-messages" id="rxMessages"></div>
  <div class="rx-footer">
    <input class="rx-input" id="rxInput" type="text" placeholder="Type a message…" autocomplete="off" />
    <button class="rx-send" id="rxSend" aria-label="Send">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
    </button>
  </div>
</div>`;

  document.body.insertAdjacentHTML('beforeend', BTN_HTML + WIN_HTML);

  const rxBtn   = document.getElementById('rxBtn');
  const rxWin   = document.getElementById('rxWindow');
  const rxClose = document.getElementById('rxClose');
  const rxMsgs  = document.getElementById('rxMessages');
  const rxInput = document.getElementById('rxInput');
  const rxSend  = document.getElementById('rxSend');

  let opened = false;

  // ── Knowledge base ──
  const KB = [
    {
      match: /\b(hi|hello|hey|good morning|good afternoon|good evening|howdy|what's up)\b/i,
      reply: "Hi there! 👋 Welcome to Oregon Landscape. I'm here to answer any questions about our services, service area, or process. What can I help you with?",
      chips: ['Services we offer', 'Get an estimate', 'Service area', 'Our process'],
    },
    {
      match: /\b(services?|what do you do|what do you offer|what can you do|offerings?)\b/i,
      reply: "We offer a full range of landscape services:\n\n• Landscape Design\n• Water Features (ponds, waterfalls, streams)\n• Outdoor Living (fire pits, kitchens, pergolas)\n• Patios & Walkways\n• Planting\n• Retaining Walls\n• Outdoor Lighting\n• Lawn & Irrigation\n• Installation & Maintenance\n\nWould you like details on any of these?",
      chips: ['Water features', 'Outdoor living', 'Patios & walkways', 'Get an estimate'],
    },
    {
      match: /\b(water feature|pond|waterfall|stream|fountain|koi|bubbler)\b/i,
      reply: "We design and build custom water features including ponds, waterfalls, streams, fountains, and bubblers — all using natural stone and built to recirculate. We also handle repairs and upgrades to existing water features. Want to get a free estimate?",
      chips: ['Get an estimate', 'See our work', 'Other services'],
    },
    {
      match: /\b(outdoor living|fire pit|outdoor kitchen|pergola|shade|seating wall|patio heater|barbecue|grill|pavilion)\b/i,
      reply: "Our outdoor living builds include custom fire pits, full outdoor kitchens, cedar and steel pergolas, seating walls, weatherproof TV and audio setups, and patio heaters — designed as a unified outdoor room, built by our in-house crew.",
      chips: ['Get an estimate', 'Patios & walkways', 'Other services'],
    },
    {
      match: /\b(patio|walkway|hardscape|flagstone|paver|slate|bluestone|stepping stone|path)\b/i,
      reply: "We install flagstone, concrete pavers, slate, and bluestone patios and walkways — including steps, seating walls, edging, and drainage planning. Every installation starts with proper sub-base preparation so your hardscape lasts for decades.",
      chips: ['Get an estimate', 'Retaining walls', 'Other services'],
    },
    {
      match: /\b(retaining wall|wall|slope|hillside|erosion|terrace|boulder)\b/i,
      reply: "We build retaining walls using natural stone, concrete block (Versa-Lok, Allan Block), and treated timber — with proper footing, drainage aggregate, and French drain on every wall. We also repair and rebuild failing walls.",
      chips: ['Get an estimate', 'Other services'],
    },
    {
      match: /\b(plant|planting|tree|shrub|hedge|perennial|grass|groundcover|mulch|bed|garden)\b/i,
      reply: "We design and install four-season planting plans — ornamental trees, privacy screens and hedges, perennials, ornamental grasses, seasonal color, and groundcovers — all selected for Oregon's specific climate and your property's sun and soil conditions.",
      chips: ['Get an estimate', 'Other services'],
    },
    {
      match: /\b(lighting|light|uplighting|path light|spotlight|security light|led|smart control)\b/i,
      reply: "We install low-voltage LED lighting systems: path and walkway lights, spotlights and up-lighting, security and area lighting, step and wall lighting, and smart controls with timer and app integration. All systems are energy-efficient and built to last.",
      chips: ['Get an estimate', 'Other services'],
    },
    {
      match: /\b(lawn|sod|turf|grass|irrigation|sprinkler|drip|watering|controller|repair|startup|blowout)\b/i,
      reply: "We install premium sod selected for Oregon's climate, with full site prep and soil amendment. We also design and install custom irrigation systems — sprinklers, drip zones, backflow preventers, and smart controllers — and handle all seasonal service and repairs.",
      chips: ['Get an estimate', 'Other services'],
    },
    {
      match: /\b(maintenance|maintain|pruning|cleanup|seasonal|mulching|spring|fall|schedule)\b/i,
      reply: "We offer ongoing maintenance programs for the landscapes we build and for existing properties — seasonal pruning, spring and fall cleanups, mulch refresh, and irrigation startup and shutdown. Same in-house crew every visit.",
      chips: ['Get an estimate', 'Other services'],
    },
    {
      match: /\b(price|cost|how much|pricing|quote|estimate|budget|expensive|cheap|afford)\b/i,
      reply: "Every project is priced based on your specific property, scope, and materials — so we don't publish flat rates. The best first step is a free on-site consultation where we walk through exactly what you want and put together a detailed written proposal. No pressure, no obligation.",
      chips: ['Get a free estimate', 'Our process', 'Service area'],
    },
    {
      match: /\b(where|area|service area|location|city|cities|cover|serve|portland|clackamas|lake oswego|west linn|happy valley|oregon city|gresham|milwaukie|tualatin|hillsboro|beaverton|dunthorpe|damascus|vancouver)\b/i,
      reply: "We serve the greater Portland metro area including:\n\nPortland · Clackamas · Lake Oswego · West Linn · Happy Valley · Oregon City · Gresham · Milwaukie · Dunthorpe · Damascus · Vancouver, WA · Tualatin · Hillsboro · Beaverton\n\nNot sure if we cover your area? Give us a call at 503-855-4976.",
      chips: ['Get an estimate', 'Contact us'],
    },
    {
      match: /\b(process|how does it work|steps?|what happens|consultation|proposal|timeline|schedule|how long)\b/i,
      reply: "Our process has 6 clear steps:\n\n1️⃣ Free consultation at your property\n2️⃣ Site assessment & custom design\n3️⃣ Design review & written proposal\n4️⃣ Installation by our in-house crew\n5️⃣ Final walkthrough & handoff\n6️⃣ Optional ongoing maintenance\n\nWant the full breakdown?",
      chips: ['View full process', 'Get an estimate', 'Timeline questions'],
    },
    {
      match: /\b(how long|timeline|weeks|months|start date|when can you|schedule)\b/i,
      reply: "Timeline depends on the project scope. A simple planting job might take 1–2 days. A full backyard transformation — hardscape, planting, irrigation, and lighting — typically runs 3–8 weeks. We give you a firm projected start and completion window before we begin.",
      chips: ['Get an estimate', 'Our process'],
    },
    {
      match: /\b(licensed|bonded|insured|lcb|license|certification|credentials|BBB|better business)\b/i,
      reply: "Yes — Oregon Landscape is fully licensed (LCB #8864), bonded, and insured. We're also BBB A+ rated since 2009. You're protected at every step of your project.",
      chips: ['Get an estimate', 'About us'],
    },
    {
      match: /\b(subcontractor|sub|in-house|crew|team|who does the work|own crew)\b/i,
      reply: "We never subcontract. Every project — design through installation — is handled by our own trained, in-house crew. That means consistent quality and one point of accountability throughout your project.",
      chips: ['Get an estimate', 'Our process'],
    },
    {
      match: /\b(warranty|guarantee|workmanship|defect|fix|come back|stand behind)\b/i,
      reply: "Every installation is backed by our workmanship warranty. If something we built fails due to installation error, we come back and make it right — no questions asked. Plant warranties are outlined in your signed project contract.",
      chips: ['Get an estimate', 'Our process'],
    },
    {
      match: /\b(phone|call|number|contact|email|reach|talk|speak|office|address)\b/i,
      reply: "You can reach us at:\n\n📞 503-855-4976\n📧 info@oregonlandscape.com\n📍 14081 SE Morning Way, Clackamas, OR 97015\n\nOr request a free estimate and we'll contact you within one business day.",
      chips: ['Get a free estimate'],
    },
    {
      match: /\b(about|who are you|founded|owner|family|history|since|years|tony|mike|jason)\b/i,
      reply: "Oregon Landscape was founded in 2009 by Tony Iranshad, Mike Myer, and Jason Booth — three partners with over 40 years of combined experience. We're owner-operated, family-run, and based in Clackamas, OR. The owners are hands-on in every project.",
      chips: ['Get an estimate', 'Our process', 'Services we offer'],
    },
    {
      match: /\b(estimate|free estimate|consultation|get started|start|begin|ready|interest)\b/i,
      reply: "Great — let's get you a free estimate. Fill out our quick request form and we'll follow up within one business day to schedule a site visit.",
      chips: ['Open estimate form'],
      action: 'estimate',
    },
    {
      match: /\b(thank|thanks|great|awesome|perfect|helpful|appreciate)\b/i,
      reply: "Happy to help! Is there anything else you'd like to know about Oregon Landscape?",
      chips: ['Get an estimate', 'Services we offer', 'Contact us'],
    },
  ];

  const FALLBACK = {
    reply: "I'm not sure I caught that — I'm a simple assistant. For specific questions, give us a call at 503-855-4976 or request a free estimate and we'll be in touch.",
    chips: ['Get a free estimate', 'Services we offer', 'Contact us'],
  };

  const CHIP_MAP = {
    'Services we offer': 'services',
    'Other services': 'services',
    'Get an estimate': 'estimate',
    'Get a free estimate': 'estimate',
    'Open estimate form': 'estimate',
    'Service area': 'service area',
    'Our process': 'process',
    'Water features': 'water features',
    'Outdoor living': 'outdoor living',
    'Patios & walkways': 'patio',
    'Retaining walls': 'retaining wall',
    'Contact us': 'contact',
    'About us': 'about',
    'See our work': 'portfolio',
    'View full process': 'process',
    'Timeline questions': 'how long',
  };

  function addMsg(text, who) {
    const el = document.createElement('div');
    el.className = `rx-msg rx-msg--${who}`;
    el.innerHTML = text.replace(/\n/g, '<br>');
    rxMsgs.appendChild(el);
    rxMsgs.scrollTop = rxMsgs.scrollHeight;
    return el;
  }

  function addChips(chips, action) {
    const wrap = document.createElement('div');
    wrap.className = 'rx-chips';
    chips.forEach((label) => {
      const btn = document.createElement('button');
      btn.className = 'rx-chip';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        wrap.remove();
        if (label === 'Open estimate form' || action === 'estimate' || label === 'Get an estimate' || label === 'Get a free estimate') {
          addMsg(label, 'user');
          setTimeout(() => {
            addMsg("Sure! Let me open the estimate form for you.", 'rx');
            setTimeout(() => {
              const modal = document.getElementById('estimateModal');
              if (modal) modal.classList.add('open'), document.body.style.overflow = 'hidden';
            }, 600);
          }, 300);
          return;
        }
        if (label === 'See our work') {
          addMsg(label, 'user');
          setTimeout(() => addMsg('Check out our <a href="portfolio.html">portfolio</a> and <a href="projects.html">featured projects</a> to see recent work.', 'rx'), 500);
          return;
        }
        if (label === 'View full process') {
          addMsg(label, 'user');
          setTimeout(() => addMsg('You can see our full step-by-step process on the <a href="process.html">Our Process page</a>.', 'rx'), 500);
          return;
        }
        const q = CHIP_MAP[label] || label.toLowerCase();
        sendMessage(q, label);
      });
      wrap.appendChild(btn);
    });
    rxMsgs.appendChild(wrap);
    rxMsgs.scrollTop = rxMsgs.scrollHeight;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'rx-typing';
    el.id = 'rxTyping';
    el.innerHTML = '<span></span><span></span><span></span>';
    rxMsgs.appendChild(el);
    rxMsgs.scrollTop = rxMsgs.scrollHeight;
    return el;
  }

  function sendMessage(text, displayText) {
    const shown = displayText || text;
    addMsg(shown, 'user');
    rxInput.value = '';

    const typing = showTyping();
    const delay = 600 + Math.min(text.length * 8, 800);

    setTimeout(() => {
      typing.remove();
      let matched = null;
      for (const entry of KB) {
        if (entry.match.test(text)) { matched = entry; break; }
      }
      const result = matched || FALLBACK;
      addMsg(result.reply, 'rx');
      if (result.chips) addChips(result.chips, result.action);
    }, delay);
  }

  function openChat() {
    rxWin.classList.add('open');
    rxBtn.style.display = 'none';
    if (!opened) {
      opened = true;
      setTimeout(() => {
        const typing = showTyping();
        setTimeout(() => {
          typing.remove();
          addMsg("Hi! 👋 I'm your Oregon Landscape assistant. How can I help you today?", 'rx');
          addChips(['Services we offer', 'Get an estimate', 'Service area', 'Our process']);
        }, 900);
      }, 200);
    }
    setTimeout(() => rxInput.focus(), 100);
  }

  function closeChat() {
    rxWin.classList.remove('open');
    rxBtn.style.display = '';
  }

  rxBtn.addEventListener('click', openChat);
  rxClose.addEventListener('click', closeChat);

  rxSend.addEventListener('click', () => {
    const txt = rxInput.value.trim();
    if (txt) sendMessage(txt);
  });

  rxInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const txt = rxInput.value.trim();
      if (txt) sendMessage(txt);
    }
  });
})();

// ── Estimate Modal ──
(function () {
  const MODAL_HTML = `
<div class="modal-backdrop" id="estimateModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="modal">
    <div class="modal__head">
      <p class="modal__title" id="modalTitle">Request a Free Estimate</p>
      <button class="modal__close" id="modalClose" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal__body">
      <form id="estimateForm" action="https://formspree.io/f/xyzgvkpb" method="POST" novalidate>
        <div class="modal__row">
          <div class="modal__field">
            <label for="mFirstName">First Name</label>
            <input id="mFirstName" name="first_name" type="text" placeholder="Tony" required />
          </div>
          <div class="modal__field">
            <label for="mLastName">Last Name</label>
            <input id="mLastName" name="last_name" type="text" placeholder="Iranshad" required />
          </div>
        </div>
        <div class="modal__row">
          <div class="modal__field">
            <label for="mEmail">Email</label>
            <input id="mEmail" name="email" type="email" placeholder="you@email.com" required />
          </div>
          <div class="modal__field">
            <label for="mPhone">Phone</label>
            <input id="mPhone" name="phone" type="tel" placeholder="503-555-0123" />
          </div>
        </div>
        <div class="modal__field">
          <label for="mAddress">Property Address</label>
          <input id="mAddress" name="address" type="text" placeholder="123 Main St, Portland, OR" />
        </div>
        <div class="modal__field">
          <label for="mService">Service Interested In</label>
          <select id="mService" name="service">
            <option value="" disabled selected>Select a service...</option>
            <option>Landscape Design</option>
            <option>Water Features</option>
            <option>Outdoor Living</option>
            <option>Patios &amp; Walkways</option>
            <option>Planting</option>
            <option>Retaining Walls</option>
            <option>Outdoor Lighting</option>
            <option>Lawn &amp; Irrigation</option>
            <option>Installation &amp; Maintenance</option>
            <option>Multiple / Not Sure</option>
          </select>
        </div>
        <div class="modal__field">
          <label for="mMessage">Tell Us About Your Project</label>
          <textarea id="mMessage" name="message" placeholder="Describe your property, goals, budget range, or anything else we should know..."></textarea>
        </div>
        <button type="submit" class="btn btn--primary" style="width:100%;justify-content:center;">Submit Request &rarr;</button>
        <p class="modal__note">We respond within one business day. No obligation.</p>
      </form>
    </div>
  </div>
</div>`;

  // Inject modal once DOM is ready
  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

  const backdrop = document.getElementById('estimateModal');
  const closeBtn = document.getElementById('modalClose');
  const form     = document.getElementById('estimateForm');

  function openModal() {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtn.focus(), 50);
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Intercept clicks on Free Estimate / Free Quote buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('a, button');
    if (!btn) return;
    const href = btn.getAttribute('href') || '';
    const text = btn.textContent.trim().toLowerCase();
    if (
      href.includes('contact-us') ||
      text.includes('free estimate') ||
      text.includes('free quote') ||
      text.includes('get a free') ||
      text.includes('request a quote') ||
      text.includes('request a consultation')
    ) {
      // Don't intercept the actual contact page link in the nav
      if (btn.classList.contains('nav__link')) return;
      e.preventDefault();
      openModal();
    }
  });

  closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
  });

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        form.innerHTML = `<div style="text-align:center;padding:2rem 0;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1e6b38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 1rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <p style="font-family:var(--font-display);font-size:1.1rem;font-weight:700;margin-bottom:.5rem;">Request Received!</p>
          <p style="color:var(--clr-text-muted);font-size:.9rem;">We'll be in touch within one business day.</p>
        </div>`;
        setTimeout(closeModal, 3000);
      } else {
        throw new Error();
      }
    } catch {
      submitBtn.textContent = 'Submit Request →';
      submitBtn.disabled = false;
      alert('Something went wrong. Please call us at 503-855-4976.');
    }
  });
})();

console.log(
  '%c Oregon Landscape %c Crafted for the Pacific Northwest ',
  'background:#8fbf4b;color:#0b0d0c;font-weight:bold;padding:4px 10px;font-family:monospace;',
  'background:#0b0d0c;color:#8fbf4b;font-family:monospace;padding:4px 10px;'
);
