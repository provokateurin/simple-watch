Feature: Initial dialog
  An initial dialog must be present
  to force the user to interact with
  the page before it plays a video

  @browser
  Scenario: Initial dialog pops up
    Given a browser being on the main page
    When clicking on the create room button
    Then the initial dialog is shown

  @browser
  Scenario: Initial dialog pops up and gets closed
    Given a browser being on the main page
    When clicking on the create room button
    When the initial dialog is shown
    When the initial dialog gets closed
    Then the initial dialog is hidden
