Feature: Trends
  Fetch the Youtube Trends
  in order to display them
  on the rooms page

  Scenario: Fetch trends
    Given a user-agent
    When fetching the trends
    Then it returns 50 videos
    Then every video has an URL
    Then every video has a thumbnail URL
    Then every video has a title

  @browser
  Scenario:
    Given a browser being on the main page
    Then the trending videos are shown

  @browser
  Scenario Outline: Clicking trending video
    Given a browser being on the main page
    When the trending videos are shown
    When clicking on <index>. trending video
    Then the browser navigates to a new room
    When the initial dialog is skipped
    Then the room has a video URL in the searchbar

    Examples:
      | index |
      | 1     |
      | 27    |
      | 46    |
