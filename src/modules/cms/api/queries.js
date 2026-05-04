import {
    gql
} from "@apollo/client";

export const GET_PAGE_BY_URI = gql `
  query GetPageByUri($uriId: ID!, $uriText: String!) {
    page(id: $uriId, idType: URI) {
      id
      slug
      uri
      title
      content
      excerpt
      acfFields {
        heading
        bannerDescription
        introText
        showBannerSection
        firstBannerButtonTitle
        firstBannerButtonLink
        secondBannerButtonTitle
        secondBannerButtonLink
        list {
          title
        }
        bannerImage {
          node {
            sourceUrl
            altText
          }
        }
        icaTitle
        icaDescription
        showIcaSection
        icaButtonTitle
        icaButtonLink
        icaImage {
          node {
            sourceUrl
            altText
          }
        }
        backgroundImage {
          node {
            sourceUrl
          }
        }
        keywords {
          title
          linkText
          linkUrl
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      template {
        templateName
      }
    }
    nodeByUri(uri: $uriText) {
      __typename
      ... on Page {
        id
        slug
        uri
        title
        content
        excerpt
        acfFields {
          heading
          bannerDescription
          introText
          showBannerSection
          firstBannerButtonTitle
          firstBannerButtonLink
          secondBannerButtonTitle
          secondBannerButtonLink
          list {
            title
          }
          bannerImage {
            node {
              sourceUrl
              altText
            }
          }
          icaTitle
          icaDescription
          showIcaSection
          icaButtonTitle
          icaButtonLink
          icaImage {
            node {
              sourceUrl
              altText
            }
          }
          backgroundImage {
            node {
              sourceUrl
            }
          }
          keywords {
            title
            linkText
            linkUrl
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        template {
          templateName
        }
      }
    }
  }
`;

export const GET_POSTS = gql `
  query GetPosts($first: Int!) {
    posts(
      first: $first
      where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        slug
        uri
        title
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql `
  query GetPostBySlug($slug: ID!, $idType: PostIdType = SLUG) {
    post(id: $slug, idType: $idType) {
      id
      slug
      uri
      title
      excerpt
      content
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      author {
        node {
          name
        }
      }
    }
  }
`;

export const GET_PAGES = gql `
  query GetPages {
    pages {
      nodes {
        id
        title
        slug
        content
        uri
        homepageHeroSection {
          introText
          backgroundImage {
            node {
              sourceUrl
            }
          }
          keywords {
            title
            linkText
            linkUrl
          }
        }
      }
    }
  }
`;
export const GET_HOME_OPTIONS = gql `
  query GetHomeOptions {
    homeSettings {
      homepageAcfFields {
        showHeroSection
        heroTitle
        heroFirstButtonText
        heroFirstButtonLink
        heroSecondButtonText
        heroSecondButtonLink
        col1TopImage {
          node {
            sourceUrl
            altText
          }
        }
        col1BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        col2TopImage {
          node {
            sourceUrl
            altText
          }
        }
        col2MiddleImage {
          node {
            sourceUrl
            altText
          }
        }
        col2BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        col3BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        col4TopImage {
          node {
            sourceUrl
            altText
          }
        }
        col4MiddleImage {
          node {
            sourceUrl
            altText
          }
        }
        col4BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        col5TopImage {
          node {
            sourceUrl
            altText
          }
        }
        col5BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        showWeOfferGems
        weOfferBackgroundImage {
          node {
            sourceUrl
            altText
          }
        }
        weOfferText
        featureList {
          featureTitle
          featureLinkText
          featurestLink
        }
        showAchivementSection
        achivementHeading
        allAchivementLinkText
        allAchivementLink
        achivementCard {
          achivementImage {
            node {
              sourceUrl
              altText
            }
          }
          achivementHoverImage {
            node {
              sourceUrl
              altText
            }
          }
          achivementTitle
          achivementLinkText
          achivementLink
        }
        showBrandStorySection
        storyLeftCard {
          storyLeftImage {
            node {
              sourceUrl
              altText
            }
          }
          storyLeftPrefix
          storyLeftTitle
          storyLeftDescription
          storyLeftButtonText
          storyLeftButtonLink
        }
        storyCenterCard {
          storyCenterFirstImage {
            node {
              sourceUrl
              altText
            }
          }
          storyCenterSecondImage {
            node {
              sourceUrl
              altText
            }
          }
          storyCenterPrefix
          storyCenterTitle
          storyCenterDescription
          storyCenterButtonText
          storyCenterButtonLink
        }
        storyRightCard {
          storyRightImage {
            node {
              sourceUrl
              altText
            }
          }
          storyRightPrefix
          storyRightTitle
          storyRightDescription
          storyRightButtonText
          storyRightButtonLink
        }
        showCompressionSection
        compressionTitle
        bonnotParisTitle
        traditionalJewelersTitle
        compressionBackgroundImage {
          node {
            sourceUrl
            altText
          }
        }
        compressionData {
          title
          bonnotParis
          traditionalJewelers
        }
        appointmentButtonText
        appointmentButtonLink
        exchangeButtonText
        exchangeButtonLink
        showBonnotParisProductSection
        bonnotParisProductCategory {
          nodes {
            databaseId
            slug
            name
          }
        }
        showBonnotSecondSection
        selectSecondProductCategory {
          nodes {
            databaseId
            slug
            name
          }
        }
        showBonnotCategorySection
        selectBonnotCategory {
          nodes {
            name
            slug
          }
        }
        bonnotCategoryTitle
        bonnotCategoryButton {
          title
          url
        }
        showProductCategorySection
        categorySectionTitle
        categorySectionButtonText
        categorySectionButtonUrl
        productCategoryColumn1Title
        productCategoryColumn1BtnTitle
        productCategoryColumn1BtnUrl
        productCategoryColumn1Image {
          node {
            sourceUrl
            altText
          }
        }
        productCategoryColumn2Title
        productCategoryColumn2BtnTitle
        productCategoryColumn2BtnUrl
        productCategoryColumn2Image {
          node {
            sourceUrl
            altText
          }
        }
        productCategoryColumn3Title
        productCategoryColumn3BtnTitle
        productCategoryColumn3BtnUrl
          productCategoryColumn3Image {
          node {
            sourceUrl
            altText
          }
        }
        showStoriesSection
        storiesProfileTitle
        storiesProfileImage {
          node {
            sourceUrl
            altText
          }
        }
        storiesProfileDescription
        storiesProfileButtonTitle
        storiesProfileButtonLink
        storiesCol1TopImage {
          node {
            sourceUrl
            altText
          }
        }
        storiesCol1TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol1TopImageTitle
        storiesCol1BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        storiesCol1BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol1BottomImageTitle
        storiesCol2TopImage {
          node {
            sourceUrl
            altText
          }
        }
        storiesCol2TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol2TopImageTitle
        storiesCol2CenterImage {
          node {
            sourceUrl
            altText
          }
        }
        storiesCol2CenterVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol2CenterImageTitle
        storiesCol2BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol2BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol2BottomImageTitle
        storiesCol3BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol3BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol3BottomImageTitle
        storiesCol4TopImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol4TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol4TopImageTitle
        storiesCol4CenterImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol4CenterVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol4CenterImageTitle
        storiesCol4BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol4BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol4BottomImageTitle
        storiesCol5TopImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol5TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol5TopImageTitle
        storiesCol5BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol5BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol5BottomImageTitle

        showSecondStoriesSection
        secondStoriesProfileImage {
          node {
            sourceUrl
            altText
          }
        }
        secondStoriesProfileDescription
        secondStoriesProfileButtonTitle
        secondStoriesProfileButtonLink
        secondStoriesCol1TopImage {
          node {
            sourceUrl
            altText
          }
        }
        secondStoriesCol1TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol1TopImageTitle
        secondStoriesCol1BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        secondStoriesCol1BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol1BottomImageTitle
        secondStoriesCol2TopImage {
          node {
            sourceUrl
            altText
          }
        }
        secondStoriesCol2TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol2TopImageTitle
        secondStoriesCol2CenterImage {
          node {
            sourceUrl
            altText
          }
        }
        secondStoriesCol2CenterVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol2CenterImageTitle
        secondStoriesCol2BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol2BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol2BottomImageTitle
        secondStoriesCol3BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol3BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol3BottomImageTitle
        secondStoriesCol4TopImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol4TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol4TopImageTitle
        secondStoriesCol4CenterImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol4CenterVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol4CenterImageTitle
        secondStoriesCol4BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol4BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol4BottomImageTitle
        secondStoriesCol5TopImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol5TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol5TopImageTitle
        secondStoriesCol5BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol5BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol5BottomImageTitle
      }
    }
  }
`;

export const GET_CATEGORY_REVIEWS_SETTINGS = gql `
  query GetCategoryReviews {
    themeSettings {
      globalAcfFields {
        showCategoryReviewsSection
        selectCategoryExplorer {
          edges {
            node {
              id
              slug
              name
              uri
            }
          }
        }
        reviewMainTitle
        reviewMainImage {
          node {
            sourceUrl
            altText
          }
        }
        reviews {
          reviewImage {
            node {
              sourceUrl
              altText
            }
          }
          reviewTitle
          reviewDescription
          reviewDateText
        }
      }
    }
  }
`;

export const GET_BEFORE_FOOTER_SETTINGS = gql `
  query GetBeforeFooterSettings {
    themeSettings {
      globalAcfFields {
        showBeforeFooterSection
        title
        description
        instagramLink
        instagramTitle
        youtubeLink
        youtubeTitle
        linkedinLink
        linkedinTitle
      }
    }
  }
`;

export const GET_INSTAGRAM_FEEDS = gql `
  query GetInstagramFeeds {
    allKGInstagramFeeds(where: { orderby: { field: DATE, order: ASC } }) {
      nodes {
        title
        instagramAcfFields {
          fieldGroupName
          instagramPostCaption
          instagramPostId
          instagramPostMediaType
          instagramPostMediaUrl
          instagramPostPermalink
          instagramPostTimestamp
          instagramPostUsername
        }
      }
    }
  }
`;

export const GET_ACHIEVEMENTS_POSTS = gql `
  query GetachievementsPost($first: Int = 10) {
    allAchievementsPost(first: $first, where: { status: PUBLISH, orderby: { field: DATE, order: DESC} }) {
      nodes {
        uri
        title
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
        achievements {
          subTitle
          portfolioImages {
            nodes {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;


export const GET_FOOTER_APPOINTMENT_POPUP = gql `
  query GetFooterAppointmentPopup {
    themeSettings {
      footerAppointmentPopup {
        showColumn1
        column1Title
        column1Description
        column1DesktopImage {
          node {
            altText
            sourceUrl
          }
        }
        column1MobileImage {
          node {
            altText
            sourceUrl
          }
        }
        column1ButtonTitle
        column1ButtonUrl
        showColumn2
        column2Title
        column2Description
        column2DesktopImage {
          node {
            altText
            sourceUrl
          }
        }
        column2MobileImage {
          node {
            altText
            sourceUrl
          }
        }
        column2ButtonTitle
        column2ButtonUrl
        showColumn3
        column3Title
        column3Description
        column3SocialIcon {
          icon {
            node {
              altText
              sourceUrl
            }
          }
          link
          title
        }
        column3ButtonTitle
        column3ButtonUrl
      }
    }
  }
`;