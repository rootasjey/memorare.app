<style>
  footer {
    background-color: #eee;
    border-top: 1px solid;
    border-top-color: rgba(80, 71, 71, 0.151);

    min-height: 200px;
    padding: 30px;

    display: flex;
    justify-content: space-around;
  }

  .footer-section ul {
    list-style-type: none;
    padding: 0;
  }

  .footer-section ul > li {
    cursor: pointer;
    padding-top: 10px;
    transition: .5s;
  }

  .footer-section ul > li:hover {
    color: rgba(0, 0, 0, 0.8);
    transition: .5s;
  }

  .footer-section {
    padding: 10px;
    margin: 10px;

    color: rgba(0, 0, 0, 0.5);
  }

  .footer-title {
    text-transform: uppercase;
    font-weight: bold;
  }
</style>

<footer>
  <div class="footer-section lang">
    <span class="footer-title">languages</span>

    <ul>
      <li>English</li>
      <li>Français</li>
    </ul>
  </div>

  <div class="footer-section dev">
    <span class="footer-title">developers</span>

    <ul>
      <li>Documentation</li>
      <li>API References</li>
      <li>API Status</li>
    </ul>
  </div>

  <div class="footer-section resources">
    <span class="footer-title">resources</span>

    <ul>
      <li>Support</li>
      <li>Contact</li>
      <li>Privacy & Terms</li>
      <li>Sitemap</li>
    </ul>
  </div>
</footer>