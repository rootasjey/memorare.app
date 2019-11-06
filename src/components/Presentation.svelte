<script>
  import { navigate } from 'svelte-routing';

  import ProfileCircle  from '../components/ProfileCircle.svelte';
  import RectButton     from '../components/RectButton.svelte';

  import { client, LIST_AUTHORS } from '../data';
  import { handle } from '../errors';
  import { status } from '../utils';

  let authors = [];
  let pageStatus = status.idle;

  main();

  function main() {
    fetchAuthors();
  }

  async function fetchAuthors() {
    pageStatus = status.loading;

    try {
      const response = await client.query({
        query: LIST_AUTHORS,
        variables: { limit: 10, order: -1 },
      });

      authors = response.data.authors.entries;
      pageStatus = status.completed;

    } catch (error) {
      handle(error);
      pageStatus = status.error;
    }
  };

  function goTo(route) {
    navigate(route);
  }

  function onClickAuthor(id) {
    navigate(`/author/${id}`);
  }
</script>

<style>
  .authors-wall {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    margin-top: 120px;
    padding: 40px 0px;
    z-index: 3;
  }

  .authors-wall-background {
    height: 700px;
    width: 140%;
    background: linear-gradient(90deg, #3F2B96 0%, #A8C0FF 100%);
    transform: rotate(-15deg);

    position: absolute;
    top: 310px;
    left: -124px;
  }

  @media (max-width: 1080px) {
    .authors-wall-background {
      top: 350px;
    }
  }

  @media (max-width: 900px) {
    .authors-wall-background {
      height: 800px;
    }
  }

  @media (max-width: 760px) {
    .authors-wall-background {
      height: 900px;
      left: -140px;
    }
  }

  @media (max-width: 680px) {
    .authors-wall-background {
      left: -140px;
      width: 160%;
    }
  }

  @media (max-width: 570px) {
    .authors-wall-background {
      height: 1050px;
      top: 450px;
      left: -160px;
    }
  }

  @media (max-width: 520px) {
    .authors-wall-background {
      width: 200%;
    }
  }

  @media (max-width: 380px) {
    .authors-wall-background {
      height: 600px;
      top: 500px;
    }
  }

  .code-card {
    height: 300px;
    width: 600px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    border-radius: 10px;

    margin: auto;
    margin-top: 100px;
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
    padding-top: 70px;

    overflow-x: hidden;
  }

  .pres__app-screenshots-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: flex-end;

    margin-top: 60px;
  }

  .screenshot-img {
    height: 600px;
    border-radius: 25px;
    border: 2px solid #706fd3;
    box-shadow: 0 3px 4px 0 rgba(0,0,0,0.14), 0 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);

    margin: 20px;
    transition: .3s;
  }

  .screenshot-img:hover {
    border-width: 3px;
    box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20);
    transition: .3s;
  }

  .pres-desc {
    font-size: 1.3em;
    margin: auto;
    color: rgba(0,0,0,0.5);

    max-width: 600px;

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

  .pres-icon-title {
    position: relative;
  }

  .heart-container {
    position: relative;
    height: 83px;
    width: 200px;
    margin: auto;
  }

  .pres-icon-title.cupid {
    position: absolute;
    left: 72px;
    top: -56px;

    animation-name: growAndShrink;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  @keyframes growAndShrink {
    0% {
      transform: scale(1);
    }

    100% {
      transform: scale(.8);
    }
  }

  .pres-section {
    margin-bottom: 200px;
    display: flex;
    flex-direction: column;
  }

  .pres-section.all-you-need {
    padding-top: 100px;
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
    padding: 10px;
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

  .rocket-container {
    display: flex;
    position: relative;
    margin: auto;
  }

  .rocket-container__star {
    position: absolute;
    top: 20px;
    left: 100px;

    animation-name: glow2;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

  @keyframes glow2 {
    0% {
      opacity: 1;
      transform: rotate(0deg);
    }
    100% {
      opacity: 0.2;
      transform: rotate(180deg);
    }
  }

  .svg-icon {
    margin-right: 10px;
  }

  .svg-rect-button {
    position: relative;
    top: 2px;
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
  <div class="pres-section">
    <div class="pres-section__icon-container">
      <img class="pres-icon-title" src="./img/idea.png" alt="idea icon" height="80" width="80" />

      <div class="lightning-container">
        <img class="lightning-0" src="./img/lightning.png" alt="idea icon" width="50" />
        <img class="lightning-1" src="./img/lightning.png" alt="idea icon" width="50" />
        <img class="lightning-2" src="./img/lightning.png" alt="idea icon" width="50" />
      </div>
    </div>

    <h1 class="pres-title"><span class="text-accent-color">Inspiration</span> comes from observation</h1>

    <div class="pres-desc">
      <span>
        Ever wanted to do something ambitious ? <br>
        Motivation is contagious. Let visionary people inspire you.
      </span>
    </div>

    <div class="authors-wall">
      {#if pageStatus === status.loading}
         <!-- content here -->
      {:else if pageStatus === status.completed}
         {#each authors as author}
          <ProfileCircle
            name="{author.name}"
            imgUrl="{author.imgUrl}"
            reveal={true}
            onClick={() => onClickAuthor(author.id)} />
        {/each}
      {:else}
        <h3>An error occurred while fetching authors.</h3>
      {/if}
    </div>

    <div class="authors-wall-background"></div>
  </div>

  <div class="pres-section">
    <div>
      <img class="pres-icon-title" src="./img/responsive.png" alt="responsive icon" height="80" width="80" />
    </div>

    <h1 class="pres-title">Nice designs look good. <br>Great designs <span class="text-accent-color">adapt</span> to you</h1>
    <div class="pres-desc">
      <span>
        From your TV to your watch, your quotes will follow you through your journey.
      </span>
    </div>

    <div class="pres__app-screenshots-list">
      <img class="screenshot-img" src="./img/tablet_screenshot.png" alt="idea icon" />
      <img class="screenshot-img" src="./img/phone_screenshot.png" alt="idea icon" />
    </div>

    <RectButton value="Download Now" alignSelf="center" >
      <div slot="beforeText">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#706fd3" viewBox="0 0 24 24"><path d="M15 10h4l-7 8-7-8h4v-10h6v10zm6 9v5h-18v-5h18zm-6 2h-1v1h1v-1zm2 0h-1v1h1v-1zm2 0h-1v1h1v-1z"/></svg>
      </div>
    </RectButton>
  </div>

  <div class="pres-section all-you-need">
    <div class="heart-container">
      <img class="pres-icon-title" src="./img/order.png" alt="donation icon" height="80" width="80" />
      <img class="pres-icon-title cupid" src="./img/cupid.png" alt="cupid icon" height="60" width="60" />
    </div>

    <h1 class="pres-title">All you <span class="text-accent-color">need</span></h1>
    <div class="pres-desc">
      <span>Don't wait to try out the cool features. They will make your life easier.</span>
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
            <img src="./img/team-2.png" alt="community driven icon" height="48" width="48">
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
    <div class="rocket-container">
      <img class="rocket-container__rocket" src="./img/product-launch.png" alt="product launch icon" height="128" width="128" />
      <img class="rocket-container__star" src="./img/star.png" alt="star icon" height="24" width="24" />
    </div>

    <h1 class="pres-title">The <span class="text-accent-color">power</span> to build great things</h1>

    <div class="pres-desc">
      <span>
        Elegant ways to integrate quotes into your application.
        Use either the GraphQL API or the available SDKs.
      </span>
    </div>

    <div class="code-card">
    </div>

    <RectButton value="Get Your API Key" alignSelf="center">
      <div slot="afterText">
        <svg class="svg-rect-button" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#706fd3" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg>
      </div>
    </RectButton>
  </div>
</div>
