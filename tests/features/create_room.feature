Feature: Create room
  Create a room with our without
  an video to start with

  @browser
  Scenario:
    Given a browser being on the main page
    When clicking on the create room button
    When the initial dialog is skipped
    Then the browser navigates to a new room
    Then the room has a video with URL "" in the searchbar

  @browser
  Scenario:
    Given a browser being on the main page
    When entering a video with the URL "https://www.youtube.com/watch?v=h9j89L8eQQk"
    When clicking on the create room button
    When the initial dialog is skipped
    Then the browser navigates to a new room
    Then the room has a video with URL "https://www.youtube.com/watch?v=h9j89L8eQQk" in the searchbar
