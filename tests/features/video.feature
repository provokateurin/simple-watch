Feature: Video
  Fetch a video's metadata
  to show a thumbnail and
  play the video on the
  rooms page

  Scenario Outline: Video fetching
    Given a user-agent
    When fetching a video with the id <id>
    Then the video has an URL
    Then the title is <title>
    Then the video has an thumbnail URL which is "https://i3.ytimg.com/vi/<id>/maxresdefault.jpg"

    Examples:
      | id          | title                                                              |
      | h9j89L8eQQk | Why Dark Video Is A Terrible Blocky Mess                           |
      | 1Jwo5qc78QU | YouTube's Copyright System Isn't Broken. The World's Is.           |
      | WUVZbBBHrI4 | Inside The Billion-Euro Nuclear Reactor That Was Never Switched On |
