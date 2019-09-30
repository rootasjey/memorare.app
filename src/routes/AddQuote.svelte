<script>
  import {
    query,
    mutate,
  } from 'svelte-apollo';

  import { navigate } from 'svelte-routing';

  import { fly } from 'svelte/transition';

  import {
    client,
    PROPOSE_QUOTE,
  } from '../data';

  import Checkbox         from '../components/Checkbox.svelte';
  import SpinnerCheckmark from '../components/SpinnerCheckmark.svelte';
  import Tags             from '../components/Tags.svelte';

  let pageState = 'waiting'; // waiting || loading || success || failure

  $: loadingSpinnerCompleted = pageState !== 'loading';

  const fieldsId = {
    authorname            : true,
    authorsummary         : false,
    authorsummarylanguage : false,
    authorurl             : false,
    comment               : false,
    lang                  : false,
    name                  : true,
    origin                : false,
    refname               : false,
    reflang               : false,
    refurl                : false,
    topics                : false,
  };

  const fieldsValue = {
    authorName            : '',
    authorSummary         : '',
    authorSummaryLanguage : 'en',
    authorUrl             : '',
    comment               : '',
    lang                  : 'en',
    name                  : '',
    origin                : '',
    refName               : '',
    refLang               : 'en',
    refUrl                : '',
    topics                : [],
  };

  const fields = [
    { id: 'authorname',             name: 'Author Name'             },
    { id: 'authorsummary',          name: 'Author Summary'          },
    { id: 'authorsummarylanguage',  name: 'Author Summary Language' },
    { id: 'authorurl',              name: 'Author URL'              },
    { id: 'comment',                name: 'Comment'                 },
    { id: 'lang',                   name: 'Language'                },
    { id: 'origin',                 name: 'Origin'                  },
    { id: 'refname',                name: 'Reference Name'          },
    { id: 'reflang',                name: 'Reference Language'      },
    { id: 'refurl',                 name: 'Reference URL'           },
    { id: 'topics',                 name: 'Topics'                  },
  ];

  let isAddFieldMenuOpenned = false;

  const toggleAddFieldMenu = () => isAddFieldMenuOpenned = !isAddFieldMenuOpenned;

  $: addButtonClass = isAddFieldMenuOpenned ? 'square-add-icon rotated' : 'square-add-icon';

  function cboxOnChange(fieldId, input) {
    fieldsId[fieldId] = input.checked;
  }

  async function onAddQuote() {
    try {
      pageState = 'loading';

      const {
        authorName,
        authorSummary,
        authorSummaryLanguage,
        authorUrl,
        comment,
        lang,
        name,
        origin,
        refLang,
        refName,
        refUrl,
        topics,
      } = fieldsValue;

      const response = await mutate(client, {
        mutation: PROPOSE_QUOTE,
        variables: {
          authorName,
          authorSummary,
          authorSummaryLanguage,
          authorUrl,
          comment,
          lang,
          name,
          origin,
          refLang,
          refName,
          refUrl,
          topics,
        }
      });

      const result = response.data.createTempQuote;

      pageState = 'success';

    } catch (error) {
      // TODO: handle error
      pageState = 'failure';
    }
  }

  function onAddAnotherQuote() {
    pageState = 'waiting';
    fieldsValue.name = '';
  }

  function onGotoDashboard() {
    navigate('/welcome')
  }
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

  .header {
    text-align: center;
  }

  .add-quote-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding-bottom: 50px;
  }

  .add-quote-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    margin-top: 100px;
  }

  .label {
    color: #706fd3;
    align-self: flex-start;
    margin-bottom: 10px;
    padding: 10px;

    border: 1px solid #706fd3;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .loading-container > p {
    font-size: 1.3em;
    color: #706fd3;
  }

  .quote-txtarea {
    color: #eee;
    background-color: #706fd3;
    font-size: 1.5em;

    border: 1px solid transparent;
    border-radius: 5px;

    min-height: 300px;
    min-width: 500px;

    padding: 20px;
    margin-bottom: 60px;

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  .quote-txtarea::placeholder {
    color: #eee;
    opacity: .8;
  }

  .quote-txtarea:focus {
    box-shadow: 0 6px 12px rgba(0,0,0,0.16), 0 6px 12px rgba(0,0,0,0.23);
  }

  textarea {
    border: 0;
    border-radius: 5px;

    min-height: 100px;
    min-width: 500px;

    padding: 20px;
  }

  input {
    height: 40px;
    border: 1px solid #706fd3;
    background-color: #eee;

    margin-right: 10px;
  }

  .cross-icon {
    color: #f56498;
    cursor: pointer;
    opacity: .8;

    font-size: 1.4em;
    transition: .3s;
  }

  .cross-icon:hover {
    opacity: 1;
    transition: .3s;
  }

  .square-add-icon {
    height: 50px;
    width: 50px;
    border: 1px solid #706fd3;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    opacity: .8;
    transition: .3s;
  }

  .square-add-icon:hover {
    opacity: 1;
    border: 1px solid #f56498;
    transition: .3s;
  }

  .square-add-icon .icon {
    transition: .3s;
  }
  .square-add-icon.rotated .icon {
    transform: rotate(45deg);
    transition: .3s;
  }

  .icon {
    font-size: 4em;
    color: #706fd3;

    height: 40px;
    width: 40px;

    line-height: .5em;
    text-align: center;
  }

  .add-fields-container {
    position: relative;
  }

  .menu-fields {
    display: flex;
    flex-direction: column;

    padding: 10px;

    position: absolute;
    bottom: 60px;

    min-width: 150px;

    background-color: #eee;

    border: 1px solid #706fd3;
    border-radius: 3px;

    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }

  .menu-fields__header {
    height: 20px;
  }

  .menu-fields__header__icon {
    font-size: 2.5em;

    position: absolute;
    right: 5px;
    top: -5px;

    color: #f56498;

    height: 40px;
    width: 40px;

    line-height: .9em;
    text-align: center;

    cursor: pointer;
    opacity: .6;
    transition: .5s;
  }

  .menu-fields__header__icon:hover {
    transform: rotate(90deg);
    opacity: 1;
    transition: .5s;
  }

  .field-cbox {
    margin: 10px 0;
  }

  select {
    border: 1px solid #706fd3;
    border-radius: 0px;
    color: #706fd3;
  }

  .spaced-block {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
  }

  span.link {
    color: #535c68;
    cursor: pointer;
    position:relative;
    transition: 0.5s color ease;
  }

  span.link:hover {
    color: #f56498;
  }

  span.link:after {
    content: "";
    transition:0.5s all ease;
    -webkit-backface-visibility:hidden;
            backface-visibility:hidden;
    position:absolute;
    bottom:-0.25em;
    left:0;

    height:1px;
    width:0;
    background:#f56498;
  }

  span.link:hover:after {
    width: 100%;
  }

</style>

<div class="add-quote-container">

  {#if pageState === 'waiting'}
     <!-- Add quote form -->
     <h1 class="header">Add a new quote</h1>

    <div class="add-quote-form">
      <span class="label">Quote's content</span>
      <textarea class="quote-txtarea"
        bind:value={fieldsValue.name}
        placeholder="With great power, comes great responsibility." />

      {#if fieldsId.lang}
        <div class="spaced-block">
          <span class="label">Quote's Language</span>
          <select name="quotelang" id="quotelang" bind:value={fieldsValue.lang}>
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </select>
        </div>
      {/if}

      {#if fieldsId.authorname}
        <div class="input-container">
          <span class="label">Author's Name</span>
          <input type="text"
            bind:value={fieldsValue.authorName}
            placeholder="Spiderman">

          <span class="cross-icon">&#10539;</span>
        </div>
      {/if}

      {#if fieldsId.authorurl}
        <div class="input-container">
          <span class="label">Author's URL</span>
          <input type="text"
            bind:value={fieldsValue.authorUrl}
            placeholder="https://en.wikipedia.org/wiki/Spider-Man">

          <span class="cross-icon">&#10539;</span>
        </div>
      {/if}

      {#if fieldsId.authorsummary}
        <div class="spaced-block">
          <span class="label">Author's Summary</span>
          <textarea
            bind:value={fieldsValue.authorSummary}
            placeholder="Spider-Man is a fictional superhero created by writer-editor Stan Lee and writer-artist Steve Ditko...." />
        </div>
      {/if}

      {#if fieldsId.authorsummarylanguage}
        <div class="spaced-block">
          <span class="label">Author's Summary Language</span>
          <select name="authorsummarylang" id="authorsummarylang"
                  bind:value={fieldsValue.authorSummaryLanguage}>
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </select>
        </div>
      {/if}

      {#if fieldsId.comment}
        <div class="spaced-block">
          <span class="label">Comment</span>
          <textarea
            bind:value={fieldsValue.comment}
            placeholder="When someone has a powerful capability, he/she should use it wisely." />
        </div>
      {/if}

      {#if fieldsId.origin}
        <div class="input-container">
          <span class="label">Origin</span>
          <input type="text" placeholder="U.S." bind:value={fieldsValue.origin}>

          <span class="cross-icon">&#10539;</span>
        </div>
      {/if}

      {#if fieldsId.refname}
        <div class="input-container">
          <span class="label">Reference's Name</span>
          <input type="text"
            bind:value={fieldsValue.refName}
            placeholder="Spider-Man (2002 film)">

          <span class="cross-icon">&#10539;</span>
        </div>
      {/if}

      {#if fieldsId.reflang}
        <div class="spaced-block">
          <span class="label">Reference's Language</span>
          <select name="reflang" id="reflang" bind:value={fieldsValue.refLang}>
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </select>
        </div>
      {/if}

      {#if fieldsId.refurl}
        <div class="input-container">
          <span class="label">Reference's URL</span>
          <input type="text"
            bind:value={fieldsValue.refUrl}
            placeholder="https://en.wikipedia.org/wiki/Spider-Man_(2002_film)">

          <span class="cross-icon">&#10539;</span>
        </div>
      {/if}

      {#if fieldsId.topics}
        <div class="spaced-block">
          <span class="label">Topics</span>
          <Tags bind:tags={fieldsValue.topics} />
        </div>
      {/if}

      <div class="add-fields-container">
        <div class="{`${addButtonClass}`}" on:click={toggleAddFieldMenu}>
          <div class="icon">&#43;</div>
        </div>

        {#if isAddFieldMenuOpenned}
          <div class="menu-fields" transition:fly="{{ y: 10, duration: 300 }}">
            <div class="menu-fields__header">
              <div class="menu-fields__header__icon" on:click={toggleAddFieldMenu}>&#215;</div>
            </div>

            {#each fields as { id, name }, i (i)}
              <div class="field-cbox">
                <Checkbox label="{name}"
                    checked={fieldsId[id]}
                    onChange={(params) => cboxOnChange(id, params.target) } />
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <div class="accent-color-button" on:click={onAddQuote}>
        <span>Add Quote</span>
      </div>

    </div>
  {:else}
    <!--loading-->
    <div class="loading-container">
      <SpinnerCheckmark isCompleted={loadingSpinnerCompleted} />

      {#if pageState === 'loading'}
         <p>Sending your quote through the wire...</p>
      {:else}
        <p>
          Your quote has been successfully proposed! <br>
          Wait for the moderators to review it. <br><br>
          Would you like to
          <span class="link" on:click={onAddAnotherQuote}>add another quote</span> or go to your
          <span class="link" on:click={onGotoDashboard}>dashboard</span>?
        </p>
      {/if}
    </div>
  {/if}

</div>