<style>
  .pricing {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    padding-top: 50px;
    padding-bottom: 200px;
    background-color: #eee;
  }

  .pricing__plan {
    max-width: 200px;
    margin-right: -5px;
    margin-bottom: 20px;
    padding: 40px;

    text-align: center;
    position: relative;
    background: #eee;

    border-radius: 5px;
    border: 1px solid #eee;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: .5s;
  }

  .pricing__plan:hover {
    border: 1px solid #706fd3;
    transition: .5s;
  }

  .pricing__plan__advantages {
    padding: 0;
  }

  .pricing__plan__advantages > li {
    list-style-type: none;
    margin-bottom: 15px;
  }

  .pricing__plan__button {
    color: white;
    background: #706fd3;
    text-transform: uppercase;

    padding: 15px;
    margin: auto;
    border-radius: 30px;

    cursor: pointer;
    position: relative;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  .pricing__plan__button:hover {
    color: white;
    background: #706fd3;

    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

    transform: translateY(-5px);
  }

  .pricing__plan__cost {
    font-size: 3em;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .pricing__plan__desc {
    color: rgba(0,0,0,0.60);
    margin: 20px 0;
  }

  .pricing__plan__title {
    text-transform: uppercase;
    font-size: 1.3em;
    font-weight: 500;
  }

  .pricing__plan__img {
    margin: 60px 0;
  }

  .pricing__plan__img > svg {
    fill: #706fd3;
  }
</style>

<div class="pricing">
  <div class="pricing__plan" style="z-index: 1;">
    <span class="pricing__plan__title">Free</span>

    <div class="pricing__plan__img">
      <svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 24 24">
        <path d="M12 3c5.514 0 10 3.685 10 8.213 0 5.04-5.146 8.159-9.913 8.159-2.027 0-3.548-.439-4.548-.712l-4.004 1.196 1.252-2.9c-.952-1-2.787-2.588-2.787-5.743 0-4.528 4.486-8.213 10-8.213zm0-2c-6.628 0-12 4.573-12 10.213 0 2.39.932 4.591 2.427 6.164l-2.427 5.623 7.563-2.26c1.585.434 3.101.632 4.523.632 7.098.001 11.914-4.931 11.914-10.159 0-5.64-5.372-10.213-12-10.213z"/>
      </svg>
    </div>

    <div class="pricing__plan__cost">$0</div>
    <div class="pricing__plan__desc">A convenient plan for most people</div>

    <ul class="pricing__plan__advantages">
      <li>1 quote per day</li>
      <li>7 days quotes history</li>
      <li>Search for specific terms</li>
      <li>Post 3 quotes per day</li>
      <li>Keep 50 favourites quotes</li>
    </ul>

    <div class="pricing__plan__button">Choose</div>
  </div>

  <div class="pricing__plan" style="z-index: 2;">
    <span class="pricing__plan__title">Premium</span>

    <div class="pricing__plan__img">
      <svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd">
        <path d="M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.739 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.601-.47 6.3-1.508 7.978-2.536 1.417.345 2.774.504 4.058.504 7.084 0 11.91-4.838 11.91-9.961 0-5.812-5.701-10.007-12-10.007zm0 2c5.514 0 10 3.592 10 8.007 0 4.917-5.144 7.961-9.91 7.961-1.937 0-3.383-.398-4.394-.644-1 .613-1.594 1.037-4.272 1.82.534-1.373.722-2.748.601-4.265-.838-1-2.025-2.4-2.025-4.872 0-4.415 4.486-8.007 10-8.007zm.217 14h-.447c-.117 0-.231-.04-.308-.109l-.594-.391h2.25l-.594.391c-.076.069-.189.109-.307.109zm.922-1h-2.279c-.138 0-.25-.111-.25-.25 0-.138.112-.25.25-.25h2.279c.138 0 .25.112.25.25s-.111.25-.25.25zm-1.322-.986h-1.414c-.013-2.57-1.403-2.878-1.403-4.647 0-1.695 1.327-2.852 3-2.852h.02c1.663.009 2.98 1.163 2.98 2.852 0 1.769-1.391 2.077-1.404 4.647h-1.414c0-2.735 1.318-3.614 1.318-4.651 0-.856-.694-1.333-1.5-1.348h-.019c-.798.022-1.481.499-1.481 1.348 0 1.037 1.317 1.915 1.317 4.651zm4.053-3.628l1.349.612-.414.91-1.298-.588c.151-.3.276-.608.363-.934zm-7.739-.001c.086.332.208.631.359.935l-1.295.588-.414-.91 1.35-.613zm9.369-.885h-1.501c.01-.335-.021-.673-.093-1h1.594v1zm-9.499 0h-1.501v-1h1.594c-.072.327-.102.663-.093.998v.002zm7.021-2.714l1.242-.882.579.816-1.252.888c-.146-.291-.336-.566-.569-.822zm-6.044-.001c-.23.252-.418.525-.569.823l-1.251-.888.578-.816 1.242.881zm4.435-1.046l.663-1.345.896.443-.663 1.345c-.278-.184-.581-.332-.896-.443zm-2.826-.001c-.315.11-.618.258-.897.442l-.663-1.343.897-.443.663 1.344zm1.913-.207c-.334-.04-.654-.042-1-.002v-1.529h1v1.531z"/>
      </svg>
    </div>

    <div class="pricing__plan__cost">$5</div>
    <div class="pricing__plan__desc">For ambitious people</div>

    <ul class="pricing__plan__advantages">
      <li>1 quote per day</li>
      <li>1 month quotes history</li>
      <li>Search for specific terms</li>
      <li>Post 10 quotes per day</li>
      <li>Keep ∞ favourites quotes</li>
      <li>Choose a personalized topic for your quote of the day</li>
    </ul>

    <div class="pricing__plan__button">Choose</div>
  </div>

  <div class="pricing__plan" style="z-index: 1;">
    <span class="pricing__plan__title">Developers</span>

    <div class="pricing__plan__img">
      <svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 24 24">
        <path d="M12 3c5.514 0 10 3.685 10 8.213 0 5.04-5.146 8.159-9.913 8.159-2.027 0-3.548-.439-4.548-.712l-4.004 1.196 1.252-2.9c-.952-1-2.787-2.588-2.787-5.743 0-4.528 4.486-8.213 10-8.213zm0-2c-6.628 0-12 4.573-12 10.213 0 2.39.932 4.591 2.427 6.164l-2.427 5.623 7.563-2.26c1.585.434 3.101.632 4.523.632 7.098.001 11.914-4.931 11.914-10.159 0-5.64-5.372-10.213-12-10.213z"/>
      </svg>

      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="position: absolute; left: 127px; top: 143px;">
        <path d="M20.272 24c-.993 0-1.927-.387-2.629-1.089l-8.858-8.858c-.397-.397-.963-.61-1.522-.563-1.969.152-3.904-.56-5.303-1.96-1.519-1.52-1.96-3.282-1.96-4.806 0-1.649.517-3.018.743-3.496l4.389 4.389c.558-.044 1.329-.54 1.87-1.21.355-.44.575-.909.605-1.267l-4.39-4.39c.992-.422 2.344-.75 3.54-.75 1.801 0 3.494.699 4.765 1.969 1.397 1.399 2.111 3.332 1.958 5.304-.043.565.162 1.12.563 1.521l8.859 8.859c.732.733 1.098 1.681 1.098 2.63 0 .934-.355 1.869-1.07 2.599-.705.721-1.649 1.118-2.658 1.118zm-12.859-12.514c1.036 0 2.051.421 2.785 1.154l8.858 8.858c.656.656 1.799.649 2.447-.013.326-.333.5-.774.49-1.241-.01-.444-.189-.864-.504-1.179l-8.858-8.858c-.814-.812-1.23-1.938-1.143-3.087.108-1.391-.395-2.752-1.379-3.737-.759-.759-1.733-1.229-2.786-1.353l2.163 2.163c.231 1.065.137 2.147-.929 3.468-1.105 1.37-2.59 2.222-4.373 1.833l-2.162-2.162c.125 1.039.589 2.023 1.352 2.786.985.986 2.347 1.491 3.736 1.38l.303-.012zm13.746 8.764c0 .507-.41.917-.917.917-.506 0-.917-.411-.917-.917s.41-.917.917-.917c.507.001.917.411.917.917z"/>
      </svg>
    </div>

    <div class="pricing__plan__cost">Pay As You Go</div>
    <div class="pricing__plan__desc">Integrate API into other apps or services</div>

    <ul class="pricing__plan__advantages">
      <li>1k first request are <b>free</b></li>
      <li>GraphQL endpoints</li>
      <li>SDKs</li>
    </ul>

    <div class="pricing__plan__button">Learn More</div>
  </div>
</div>
