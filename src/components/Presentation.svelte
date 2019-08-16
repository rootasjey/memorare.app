<script>
  import { getClient, query }     from 'svelte-apollo';
  import { client, LIST_AUTHORS } from '../data';

  const listAuthors = query(client, { query: LIST_AUTHORS });
</script>

<style>
  .accent-color-button {
    background: white;
    padding: 15px;
    margin: auto;
    border-radius: 2px;
    cursor: pointer;
    position: relative;

    display: flex;
    align-items: center;

    text-transform: uppercase;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  .accent-color-button:hover {
    color: white;
    background: #706fd3;

    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

    transform: translateY(-5px);
  }

  .accent-color-button > svg {
    margin-right: 10px;
    margin-left: 10px;
  }

  .accent-color-button > svg:first-child {
    margin-right: 10px;
  }

  .accent-color-button > svg:last-child {
    margin-left: 10px;
  }

  .accent-color-button:hover > svg {
    fill: white;
  }

  .authors-wall {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    margin-top: 40px;
    padding: 40px 0px;
    z-index: 3;
  }

  .authors-wall-background {
    height: 700px;
    width: 140%;
    background: linear-gradient(90deg, #3F2B96 0%, #A8C0FF 100%);
    transform: rotate(-15deg);

    position: absolute;
    top: 210px;
    left: -124px;
  }

  .author-square {
    height: 150px;
    width: 150px;
    margin: 10px;
    padding: 10px;
    border-radius: 50%;

    position: relative;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;

    color: white;

    cursor: pointer;

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: .5s;
  }

  .author-square:hover {
    background-color: #706fd3;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }

  .author-square:hover .author-square__name {
    background-color: #706fd3;
    opacity: .5;
    transition: .5s;
  }

  .author-square:hover .author-square__img {
    background-color: #706fd3;
    opacity: 1;
    transform: scale(1.1);
    transition: .5s;
  }

  .author-square__name {
    font-size: 1.2em;
    font-weight: bold;

    display: flex;
    justify-content: center;
    align-items: center;

    opacity: 1;
    color: rgba(0,0,0,.5);

    background-color: #eee;

    height: 100%;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;

    position: absolute;
    top: 0;

    z-index: 2;
    transition: .5s;
  }

  .author-square__img {
    height: 100%;
    width: 100%;

    opacity: 1;

    position: absolute;

    background-repeat: no-repeat;
    background-size: cover;

    -moz-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -o-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -webkit-filter: grayscale(100%);
    filter: gray;
    filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");

    transition: .5s;
  }

  .device-item {
    margin-right: 10px;
    cursor: pointer;
    position: relative;
    transition: .5s;
  }

  .device-item:hover {
    transform: translateY(-10px);
    transition: .5s;
  }

  .device-item:hover svg {
    fill: #706fd3;
    transition: .5s;
  }

  .icon-title {
    color: #706fd3;
    display: flex;
  }

  .icon-title > h3 {
    color: #706fd3;
    text-transform: uppercase;
  }

  .icon-title svg {
    fill: #706fd3;
  }

  .lightning-container {
    width: 100px;
    height: 100px;
    position: relative;
    top: -70px;
  }

  .lightning-0 {
    position: absolute;
    left: -42px;
    transform: scale(-1,1);
    top: -49px;

    animation-name: glow;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-delay: 0s;
  }

  .lightning-1 {
    position: absolute;
    left: 28px;
    top: -80px;

    animation-name: glow;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-delay: .25s;
  }

  .lightning-2 {
    position: absolute;
    right: -42px;
    transform: rotate(20deg);
    top: -49px;

    animation-name: glow;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-delay: .5s;
  }

  @keyframes glow {
    0% {
      opacity: 0;
    }
    25% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  .presentation {
    background-color: #eee;
    text-align: center;

    position: relative;
  }

  .pres-desc {
    font-size: 1.3em;
    margin: 0 10%;
    color: rgba(0,0,0,0.5);

    position: relative;
    z-index: 2;
  }

  .pres-desc > span {
    color: white;
    background-color: #f56498;
    padding: 5px;
    line-height: 1.6em;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }

  .pres__devices-list {
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .pres-icon-title {
    position: relative;
  }

  .pres-section {
    margin-bottom: 200px;
    display: flex;
    flex-direction: column;
  }

  .pres-section__icon-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-bottom: -100px;
  }

  .pres-subsection {
    margin-top: 50px;
    text-align: initial;
    max-width: 400px;
  }

  .pres-subsection > p {
    font-size: 1.2em;
  }

  .pres-subsection-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .pres-title {
    font-size: 2.2em;
  }

  .svg-icon {
    margin-right: 10px;
  }

  .text-accent-color {
    color: #706fd3;
  }

  .text-icon {
    font-size: 3em;
    font-weight: bold;
    margin-right: 10px;
  }

</style>

<div class="presentation">
  <div class="pres-section inspiration">

    <div class="pres-section__icon-container">
      <img class="pres-icon-title" src="./img/idea.png" alt="idea icon" height="80" width="80" />

      <div class="lightning-container">
        <img class="lightning-0" src="./img/lightning.png" alt="idea icon" width="50" />
        <img class="lightning-1" src="./img/lightning.png" alt="idea icon" width="50" />
        <img class="lightning-2" src="./img/lightning.png" alt="idea icon" width="50" />
      </div>
    </div>

    <h1 class="pres-title">Get <span class="text-accent-color">inspired</span></h1>
    <div class="pres-desc">
      <span>
        Ever wanted to do something ambitious ? <br>
        Motivation is contagious. Let visionary people inspire you.
      </span>
    </div>

    <div class="authors-wall">
      {#await $listAuthors}
        <!-- $listAuthors is pending -->
        ...
      {:then result}
        <!-- $listAuthors was fulfilled -->
        {#each result.data.listAuthors.entries as author}
          <div class="author-square">
            <div class="author-square__img" style="background-image: url('{author.imgUrl}');"></div>
            <div class="author-square__name"> {author.name} </div>
          </div>
        {/each}
      {/await}
    </div>

    <div class="authors-wall-background"></div>
  </div>

  <div class="pres-section">
    <h1 class="pres-title">Delivered <span class="text-accent-color">where</span> you are</h1>
    <div class="pres-desc">
      <p>
        From your TV to your watch, your quotes will follow you through your journey.
      </p>
    </div>

    <div class="pres__devices-list">
      <div class="device-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="0 0 24 24">
          <path d="M18 24h-12c-1.104 0-2-.896-2-2v-20c0-1.104.896-2 2-2h12c1.104 0 2 .896 2 2v20c0 1.104-.896 2-2 2zm1-5.083h-14v3.083c0 .552.449 1 1 1h12c.552 0 1-.448 1-1v-3.083zm-7 3c-.553 0-1-.448-1-1s.447-1 1-1c.552 0 .999.448.999 1s-.447 1-.999 1zm7-17h-14v13h14v-13zm-1-3.917h-12c-.551 0-1 .449-1 1v1.917h14v-1.917c0-.551-.448-1-1-1zm-4.5 1.917h-3c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h3c.276 0 .5.224.5.5s-.224.5-.5.5z"/>
        </svg>
      </div>

      <div class="device-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
          <path d="M19 24c1.104 0 2-.896 2-2v-20c0-1.104-.896-2-2-2h-14c-1.104 0-2 .896-2 2v20c0 1.104.896 2 2 2h14zm-14-3v-18h14v18h-14zm6.5 1.5c0-.276.224-.5.5-.5s.5.224.5.5-.224.5-.5.5-.5-.224-.5-.5z"/>
        </svg>
      </div>

      <div class="device-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd">
          <path d="M5 22h4v-3h-9v-18h24v18h-10v3h4v1h-13v-1zm5-3v3h3v-3h-3zm13-17h-22v16h22v-16z"/>
        </svg>
      </div>

      <div class="device-item" style="bottom: -20px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 24 24">
          <path d="M22 17v-11.8c0-.663-.537-1.2-1.2-1.2h-17.6c-.663 0-1.2.537-1.2 1.2v11.8h20zm-18-11h16v9h-16v-9zm20 12v.8c0 .663-.537 1.2-1.2 1.2h-21.6c-.663 0-1.2-.537-1.2-1.2v-.8h10c0 .276.224.5.5.5h3c.276 0 .5-.224.5-.5h10z"/>
        </svg>
      </div>

      <div class="device-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
          <path d="M12 12h3v2h-5v-6h2v4zm9-1h-1.07c-.251-2.006-1.218-3.792-2.647-5.093-1.283-1.166-1.228-2.247-1.856-5.907h-7.854c-.628 3.66-.573 4.741-1.856 5.907-1.67 1.52-2.717 3.701-2.717 6.124 0 2.424 1.048 4.606 2.72 6.126 1.28 1.164 1.232 2.267 1.853 5.843h7.854c.622-3.576.573-4.679 1.854-5.843 1.445-1.314 2.421-3.124 2.66-5.157h1.059v-2zm-9.5 7.5c-3.589 0-6.5-2.911-6.5-6.5s2.911-6.5 6.5-6.5 6.5 2.911 6.5 6.5-2.911 6.5-6.5 6.5z"/>
        </svg>
      </div>
    </div>

    <div class="accent-color-button" style="top: 80px;">
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
        <path d="M6 16h-5v6h22v-6h-5v-1h6v8h-24v-8h6v1zm14 2c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm-7.5-17v14.884l4.736-5.724.764.645-5.979 7.195-6.021-7.205.765-.644 4.735 5.732v-14.883h1z"/>
      </svg>
      <span>Download Now</span>
    </div>
  </div>

  <div class="pres-section">
    <h1 class="pres-title">All you <span class="text-accent-color">need</span></h1>
    <div class="pres-desc">
      <p>Don't wait to try out the cool features. They will make your life easier.</p>
    </div>

    <div class="pres-subsection-list">
      <div class="pres-subsection">
        <div class="icon-title">
          <div class="text-icon">1</div>
          <h3>One quote every day</h3>
        </div>
        <p>
          You will receive one quote every day to focus on. Thus to limit unecessary browsing.
        </p>
      </div>

      <div class="pres-subsection">
        <div class="icon-title">
          <div class="svg-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd">
              <path d="M1.886 14.826l2.534 4.24-.669.155c-.67.154-1.152.529-1.356 1.052-.161.416-.124.875.099 1.199.24.352.64.553 1.097.553.808 0 1.6-.635 1.835-1.424.102-.339.148-.865-.206-1.441l-2.803-4.656-.531.322zm1.705 8.199c-.792 0-1.493-.359-1.921-.984-.407-.596-.486-1.41-.206-2.129.25-.643.755-1.15 1.427-1.453l-2.374-3.972 2.239-1.359 3.317 5.512c.426.69.537 1.491.311 2.248-.276.926-1.288 2.137-2.793 2.137m14.433.975c.275-.01.491-.24.482-.518-.057-1.629.359-1.939 1.376-2.052 1.502-.17 1.71-1.084 1.86-1.752.161-.707.267-1.176 1.78-1.256.275-.014.487-.248.471-.526-.012-.275-.243-.49-.524-.472-2.095.109-2.473 1.025-2.701 2.033-.139.609-.201.889-.997.978-2.075.233-2.315 1.62-2.265 3.082.01.27.232.483.5.483h.018zm2.665-11.032l.811.388-.118-.893.62-.653-.886-.164-.427-.792-.429.792-.885.164.62.653-.119.893.813-.388zm2.046 2.087l-2.046-.978-2.047.978.299-2.25-1.564-1.644 2.231-.412 1.081-1.996 1.08 1.996 2.23.412-1.562 1.644.298 2.25zm-9.622-14.054c-.291 0-.573.062-.839.185-1.008.464-1.451 1.663-.988 2.672.449.977 1.685 1.441 2.671.989.489-.226.86-.627 1.046-1.132.187-.505.165-1.052-.059-1.541-.328-.712-1.046-1.173-1.831-1.173m.004 5.031c-1.173 0-2.249-.689-2.739-1.755-.693-1.511-.031-3.305 1.478-4 .398-.183.821-.276 1.257-.276 1.174 0 2.25.689 2.739 1.755.336.731.367 1.55.089 2.305-.279.757-.835 1.358-1.566 1.694-.398.184-.821.277-1.258.277m-7.384-2.536c.911 1.47 3.573 5.365 3.573 5.365l-.785 3.399c-.237.886-.13 1.453.047 2.159l2.076 8.591.386-7.645 4.354 1.984s-.602 3.082-.804 4.135c0 0 1.429-3.385 1.772-4.228.138-.342.074-.547-.301-.961-.704-.783-2.549-2.706-2.549-2.706l.791-3.449s4.197-2.938 5.469-3.912c.064-.048.063-.085.053-.114l-.09-.066c-.888.334-2.443 1.008-3.63 1.522l-1.165.504c-.366.156-.775.189-1.16.09l-3.325-.836c-.368-.092-.712-.273-.996-.526l-3.716-3.306zm4.921 20.492c-.401-.002-.891-.248-1.059-.937-.498-2.034-1.999-8.395-1.999-8.395-.197-.791-.338-1.54-.045-2.638l.682-2.955c-.521-.763-2.542-3.727-3.339-4.938-.223-.34-.249-.742-.069-1.077.297-.551 1.101-.719 1.571-.3l3.717 3.306c.164.145.363.251.575.304l3.326.836c.173.045.358.03.523-.041l1.162-.501c1.196-.518 2.765-1.198 3.573-1.516.616-.244 1.291.068 1.491.657.151.449-.003.932-.394 1.231-1.159.886-4.42 3.177-5.187 3.716l-.584 2.546c.456.477 1.63 1.71 2.194 2.337.445.49.85 1.113.486 2.012-.343.845-.958 2.298-1.416 3.384l-.366.866c-.284.675-1.263.837-1.698.31-.195-.236-.266-.557-.2-.898.155-.809.5-2.578.653-3.364l-2.284-1.041c-.067 1.557-.22 5.104-.274 6.075-.033.591-.47 1.021-1.039 1.021m-7.72-17.988l-2.934 2.937 2.934 2.937 2.935-2.937-2.935-2.937zm0 1.415l1.521 1.522-1.521 1.522-1.52-1.522 1.52-1.522z"/>
            </svg>
          </div>
          <h3>Community-driven</h3>
        </div>
        <p>
          This app is based on its community as you can add your own quotes into the app.
          The added quotes will be available to every other users.
        </p>
      </div>

      <div class="pres-subsection">
        <div class="icon-title">
          <div class="svg-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
              <path d="M13.144 8.171c-.035-.066.342-.102.409-.102.074.009-.196.452-.409.102zm-2.152-3.072l.108-.031c.064.055-.072.095-.051.136.086.155.021.248.008.332-.014.085-.104.048-.149.093-.053.066.258.075.262.085.011.033-.375.089-.304.171.096.136.824-.195.708-.176.225-.113.029-.125-.097-.19-.043-.215-.079-.547-.213-.68l.088-.102c-.206-.299-.36.362-.36.362zm13.008 6.901c0 6.627-5.373 12-12 12-6.628 0-12-5.373-12-12s5.372-12 12-12c6.627 0 12 5.373 12 12zm-8.31-5.371c-.006-.146-.19-.284-.382-.031-.135.174-.111.439-.184.557-.104.175.567.339.567.174.025-.277.732-.063.87-.025.248.069.643-.226.211-.381-.355-.13-.542-.269-.574-.523 0 0 .188-.176.106-.166-.218.027-.614.786-.614.395zm6.296 5.371c0-1.035-.177-2.08-.357-2.632-.058-.174-.189-.312-.359-.378-.256-.1-1.337.597-1.5.254-.107-.229-.324.146-.572.008-.12-.066-.454-.515-.605-.46-.309.111.474.964.688 1.076.201-.152.852-.465.992-.038.268.804-.737 1.685-1.251 2.149-.768.694-.624-.449-1.147-.852-.275-.211-.272-.66-.55-.815-.124-.07-.693-.725-.688-.813l-.017.166c-.094.071-.294-.268-.315-.321 0 .295.48.765.639 1.001.271.405.416.995.748 1.326.178.178.858.914 1.035.898.193-.017.803-.458.911-.433.644.152-1.516 3.205-1.721 3.583-.169.317.138 1.101.113 1.476-.029.433-.37.573-.693.809-.346.253-.265.745-.556.925-.517.318-.889 1.353-1.623 1.348-.216-.001-1.14.36-1.261.007-.094-.256-.22-.45-.353-.703-.13-.248-.015-.505-.173-.724-.109-.152-.475-.497-.508-.677-.002-.155.117-.626.28-.708.229-.117.044-.458.016-.656-.048-.354-.267-.646-.53-.851-.389-.299-.188-.537-.097-.964 0-.204-.124-.472-.398-.392-.564.164-.393-.44-.804-.413-.296.021-.538.209-.813.292-.346.104-.7-.082-1.042-.125-1.407-.178-1.866-1.786-1.499-2.946.037-.19-.114-.542-.048-.689.158-.352.48-.747.762-1.014.158-.15.361-.112.547-.229.287-.181.291-.553.572-.781.4-.325.946-.318 1.468-.388.278-.037 1.336-.266 1.503-.06 0 .038.191.604-.019.572.433.023 1.05.749 1.461.579.211-.088.134-.736.567-.423.262.188 1.436.272 1.68.069.15-.124.234-.93.052-1.021.116.115-.611.124-.679.098-.12-.044-.232.114-.425.025.116.055-.646-.354-.218-.667-.179.131-.346-.037-.539.107-.133.108.062.18-.128.274-.302.153-.53-.525-.644-.602-.116-.076-1.014-.706-.77-.295l.789.785c-.039.025-.207-.286-.207-.059.053-.135.02.579-.104.347-.055-.089.09-.139.006-.268 0-.085-.228-.168-.272-.226-.125-.155-.457-.497-.637-.579-.05-.023-.764.087-.824.11-.07.098-.13.201-.179.311-.148.055-.287.126-.419.214l-.157.353c-.068.061-.765.291-.769.3.029-.075-.487-.171-.453-.321.038-.165.213-.68.168-.868-.048-.197 1.074.284 1.146-.235.029-.225.046-.487-.313-.525.068.008.695-.246.799-.36.146-.168.481-.442.724-.442.284 0 .223-.413.354-.615.131.053-.07.376.087.507-.01-.103.445.057.489.033.104-.054.684-.022.594-.294-.1-.277.051-.195.181-.253-.022.009.34-.619.402-.413-.043-.212-.421.074-.553.063-.305-.024-.176-.52-.061-.665.089-.115-.243-.256-.247-.036-.006.329-.312.627-.241 1.064.108.659-.735-.159-.809-.114-.28.17-.509-.214-.364-.444.148-.235.505-.224.652-.476.104-.178.225-.385.385-.52.535-.449.683-.09 1.216-.041.521.048.176.124.104.324-.069.19.286.258.409.099.07-.092.229-.323.298-.494.089-.222.901-.197.334-.536-.374-.223-2.004-.672-3.096-.672-.236 0-.401.263-.581.412-.356.295-1.268.874-1.775.698-.519-.179-1.63.66-1.808.666-.065.004.004-.634.358-.681-.153.023 1.247-.707 1.209-.859-.046-.18-2.799.822-2.676 1.023.059.092.299.092-.016.294-.18.109-.372.801-.541.801-.505.221-.537-.435-1.099.409l-.894.36c-1.328 1.411-2.247 3.198-2.58 5.183-.013.079.334.226.379.28.112.134.112.712.167.901.138.478.479.744.74 1.179.154.259.41.914.329 1.186.108-.178 1.07.815 1.246 1.022.414.487.733 1.077.061 1.559-.217.156.33 1.129.048 1.368l-.361.093c-.356.219-.195.756.021.982 1.818 1.901 4.38 3.087 7.22 3.087 5.517 0 9.989-4.472 9.989-9.989zm-11.507-6.357c.125-.055.293-.053.311-.22.015-.148.044-.046.08-.1.035-.053-.067-.138-.11-.146-.064-.014-.108.069-.149.104l-.072.019-.068.087.008.048-.087.106c-.085.084.002.139.087.102z"/>
            </svg>
          </div>
          <h3>Multilingual</h3>
        </div>
        <p>
          Read quote in your own language as different languages are supported.
        </p>
      </div>

      <div class="pres-subsection">
        <div class="icon-title">
          <div class="svg-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd">
              <path d="M16.086 24h-2.165c-1.278-3.005-1.458-5.067.182-7 .553-.651 1.417-1.479 1.804-1.877.952-.982 2.405-1.063 3.089-.23v-3.304c.035-1.578 1.16-2.589 2.457-2.589 1.41 0 2.455.999 2.546 2.486l.001 4.842c-.022.987-.129 1.435-.647 2.404-.828 1.515-1.832 3.17-2.099 5.268h-2.011c.307-3.069 2.075-5.58 2.545-6.606.18-.397.204-.592.213-1.015v-4.812c0-.723-1.006-.723-1.006.001v3.888c-.034.786-.334 1.251-.85 1.858-.5.587-1.796 2.07-2.36 2.686-.817.895-2.095-.22-1.367-1.219.153-.21 1.248-1.362 1.453-1.624.439-.557-.119-1.007-.629-.515-.724.723-1.505 1.561-1.75 1.828-1.284 1.399.11 4.383.594 5.53zm-6.007 0c1.278-3.005 1.458-5.067-.182-7-.553-.651-1.417-1.479-1.804-1.877-.952-.982-2.405-1.063-3.089-.23v-3.304c-.035-1.578-1.16-2.589-2.457-2.589-1.41 0-2.455.999-2.546 2.486l-.001 4.842c.022.987.129 1.435.647 2.404.828 1.515 1.832 3.171 2.099 5.268h2.011c-.307-3.069-2.075-5.58-2.545-6.606-.18-.397-.204-.592-.213-1.015v-4.812c0-.723 1.006-.723 1.006.001v3.888c.034.786.334 1.251.85 1.858.5.587 1.796 2.07 2.36 2.686.817.895 2.095-.22 1.367-1.219-.153-.21-1.248-1.362-1.453-1.624-.439-.557.119-1.007.629-.515.724.723 1.505 1.561 1.75 1.828 1.284 1.4-.11 4.383-.594 5.53h2.165zm2.21-8h-.596c-.156 0-.307-.053-.41-.145l-.792-.522h3l-.792.522c-.102.092-.253.145-.41.145zm1.23-1.333h-3.038c-.184 0-.334-.149-.334-.334 0-.184.15-.333.334-.333h3.038c.184 0 .334.149.334.333 0 .185-.149.333-.334.334zm-1.763-1.315h-1.886c-.017-3.426-1.87-3.837-1.87-6.196 0-2.26 1.77-3.802 4-3.802h.026c2.218.012 3.974 1.551 3.974 3.802 0 2.359-1.855 2.77-1.872 6.196h-1.886c0-3.647 1.758-4.819 1.758-6.201 0-1.141-.925-1.778-2-1.798h-.025c-1.064.03-1.975.666-1.975 1.798 0 1.382 1.756 2.554 1.756 6.201zm-4.915-4.838c.116.443.277.841.48 1.247l-1.471.676-.551-1.214 1.542-.709zm10.318 0l1.488.687-.551 1.215-1.419-.656c.2-.4.366-.81.482-1.246zm2.174-1.181h-2.002c.014-.446-.026-.896-.123-1.333h2.125v1.333zm-12.664 0h-2.002v-1.333h2.124c-.095.436-.135.884-.122 1.33v.003zm9.36-3.618l1.656-1.176.772 1.088-1.67 1.184c-.194-.388-.446-.754-.758-1.096zm-8.058-.001c-.307.335-.558.7-.759 1.097l-1.669-1.184.772-1.088 1.656 1.175zm5.912-1.395l.885-1.793 1.195.59-.884 1.793c-.372-.244-.774-.442-1.196-.59zm-3.767-.001c-.421.147-.824.344-1.196.589l-.884-1.791 1.196-.59.884 1.792zm2.551-.277c-.446-.052-.873-.055-1.334-.002v-2.039h1.334v2.041z"/>
            </svg>
          </div>
          <h3>Easy share</h3>
        </div>

        <p>
          You have the power to inspire other people by sharing your loved quotes.
        </p>
      </div>

      <div class="pres-subsection">
        <div class="icon-title">
          <div class="svg-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
              <path d="M12 9.229c.234-1.12 1.547-6.229 5.382-6.229 2.22 0 4.618 1.551 4.618 5.003 0 3.907-3.627 8.47-10 12.629-6.373-4.159-10-8.722-10-12.629 0-3.484 2.369-5.005 4.577-5.005 3.923 0 5.145 5.126 5.423 6.231zm-12-1.226c0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-7.962-9.648-9.028-12-3.737-2.338-5.262-12-4.27-12 3.737z"/>
            </svg>
          </div>
          <h3>Favourite</h3>
        </div>
        <p>
          Found the perfect quote ? Add it to your favourites so you can read it whenever you feel the need to.
        </p>
      </div>

      <div class="pres-subsection">
        <div class="icon-title">
          <div class="svg-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd">
              <path d="M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5z"/>
            </svg>
          </div>
          <h3>Search</h3>
        </div>
        <p>
          Looking for a specific quote ? Use the search to find out what you want..
        </p>
      </div>
    </div>
  </div>

  <div class="pres-section">
    <h1 class="pres-title">For <span class="text-accent-color">developers</span></h1>

    <div class="pres-desc">
      <p>
        Quotes as a service. A complete and easy solution to integrate with other services.
        Use either the GraphQL API or the available SDK.
      </p>
    </div>

    <div style="position: relative; top: 40px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
        <path d="M23 17h-22v7h22v-7zm-20 5l.863-3h1.275l-.863 3h-1.275zm2.066 0l.863-3h1.275l-.863 3h-1.275zm2.067 0l.863-3h1.275l-.864 3h-1.274zm2.066 0l.863-3h1.274l-.863 3h-1.274zm3.341 0h-1.274l.863-3h1.275l-.864 3zm7.46-.5c-.552 0-1-.448-1-1s.448-1 1-1c.553 0 1 .448 1 1s-.447 1-1 1zm1-19.5v11h-18v-11h18zm2-2h-22v15h22v-15zm-13 7.5l-2.563-2.5-.771.751 1.794 1.749-1.794 1.749.771.751 2.563-2.5zm7 1.5h-5v1h5v-1z"/>
      </svg>
    </div>

    <div class="accent-color-button" style="top: 80px;">
      <span>Get Your API key</span>
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
        <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
      </svg>
    </div>
  </div>
</div>
