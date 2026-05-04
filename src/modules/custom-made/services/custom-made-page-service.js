import { getClient } from "@/apollo/register-client";
import {
  GET_ACHIEVEMENTS_POSTS,
  GET_CUSTOM_MADE_PAGE_BY_URI,
  GET_GLOBAL_ACF_FIELDS,
} from "@/modules/custom-made/api/queries";

function normalizeUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export async function fetchCustomMadePageByUri(uri) {
  const client = getClient();
  const normalizedUri = normalizeUri(uri);

  const [pageRes, achievementsRes, globalAcfFieldsRes] = await Promise.all([
    client.query({
      query: GET_CUSTOM_MADE_PAGE_BY_URI,
      variables: { uriId: normalizedUri },
      fetchPolicy: "no-cache",
    }),
    client.query({
      query: GET_ACHIEVEMENTS_POSTS,
      fetchPolicy: "no-cache",
    }),
    client.query({
      query: GET_GLOBAL_ACF_FIELDS,
      fetchPolicy: "no-cache",
    }),
  ]);

  const data = pageRes?.data;
  const globalAcf = globalAcfFieldsRes?.data?.themeSettings?.globalAcfFields ?? null;
  const errors = [
    ...(pageRes?.errors ?? []),
    ...(achievementsRes?.errors ?? []),
    ...(globalAcfFieldsRes?.errors ?? []),
  ];

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return {
    acf: data?.page?.customMadePageAcfField ?? null,
    globalAcfFields: globalAcf,
    achievementsPosts: achievementsRes?.data?.allAchievementsPost?.nodes ?? [],
  };
}

export async function fetchCustomMadePageConfigByUri(uri, fallback = {}) {
  const pageData = await fetchCustomMadePageByUri(uri).catch(() => null);
  const acf = pageData?.acf ?? null;
  const globalAcf = pageData?.globalAcfFields ?? null;
  const achievementsPosts = Array.isArray(pageData?.achievementsPosts)
    ? pageData.achievementsPosts
    : [];
  
  const showHeroSection =
    acf?.showHeroPageSection !== false && acf?.showHeroPageSection !== "No";
  const showBreadcrumbSection =
    acf?.showBreadcrumbSection !== false && acf?.showBreadcrumbSection !== "No";
    
  const showJewelryInfoSection =
    acf?.showJewelryInfoSection !== false && acf?.showJewelryInfoSection !== "No";

  const showStepSection =
    acf?.showStepSection !== false && acf?.showStepSection !== "No";
  const stepSectionList = acf?.stepSectionList || fallback.stepSectionList || [];

  const steps = stepSectionList.map((step, index) => ({
    number: String(step?.stepNumber ?? "").trim() || `step ${index + 1}`,
    title: String(step?.stepTitle ?? "").trim(),
    subtitle: String(step?.stepHighlightedText ?? "").trim(),
    body: String(step?.stepDescription ?? "").trim(),
    buttonText: String(step?.stepButtonText ?? "").trim(),
    buttonLink: String(step?.stepButtonLink ?? "").trim(),
    image: String(step?.stepImage?.node?.sourceUrl ?? "").trim(),
    imageAlt: String(step?.stepImage?.node?.altText ?? "").trim(),
  }));

  const showCenterVideoSection =
    globalAcf?.showCenterVideoSection !== false && globalAcf?.showCenterVideoSection !== "No";

  const showOurAchievementsSection =
    acf?.showOurAchievementsSection !== false && acf?.showOurAchievementsSection !== "No";

  const showBonnotHouseParisSection =
    acf?.showBonnotHouseParisSection !== false && acf?.showBonnotHouseParisSection !== "No";

  const showOurKnowSection =
    acf?.showOurKnowSection !== false && acf?.showOurKnowSection !== "No";

  const showCertificationBySection =
    acf?.showCertificationBySection !== false && acf?.showCertificationBySection !== "No";

  const showFaqSection =
        acf?.showFaqSection !== false && acf?.showFaqSection !== "No";

  const showTestimonialsSection =
    acf?.showTestimonialsSection !== false && acf?.showTestimonialsSection !== "No";

  return {
    raw: acf,
    hero: {
      show: showHeroSection,
      title1: String(acf?.pageHeroTitle1 ?? "").trim() || fallback.title1 || "",
      title2: String(acf?.pageHeroTitle2 ?? "").trim() || fallback.title2 || "",
      image:
        acf?.pageHeroImage?.node?.sourceUrl ||
        fallback.image ||
        "",
      imageAlt:
        String(acf?.pageHeroImage?.node?.altText ?? "").trim() ||
        fallback.imageAlt ||
        "",
    },
    breadcrumb: {
      show: showBreadcrumbSection,
      firstTitle:
        String(acf?.breadcrumbFirstTitle ?? "").trim() ||
        fallback.breadcrumbFirstTitle ||
        "",
      firstLink:
        String(acf?.breadcrumbFirstTitleLink ?? "").trim() ||
        fallback.breadcrumbFirstTitleLink ||
        "",
      secondTitle:
        String(acf?.breadcrumbSecondTitle ?? "").trim() ||
        fallback.breadcrumbSecondTitle ||
        "",
      secondLink:
        String(acf?.breadcrumbSecondTitleLink ?? "").trim() ||
        fallback.breadcrumbSecondTitleLink ||
        "",
    },
    jewelryInfo: {
      show: showJewelryInfoSection,
      title: String(acf?.jewelryInfoTitle ?? "").trim() || fallback.jewelryInfoTitle || ""  ,
      subHeading: String(acf?.jewelryInfoSubHeading ?? "").trim() || fallback.jewelryInfoSubHeading || "",
      description: String(acf?.jewelryInfoDescription ?? "").trim() || fallback.jewelryInfoDescription || "",
      buttonTitle: String(acf?.jewelryInfoButtonTitle ?? "").trim() || fallback.jewelryInfoButtonTitle || "",
      buttonLink: String(acf?.jewelryInfoButtonLink ?? "").trim() || fallback.jewelryInfoButtonLink || "",
      imageSrc: acf?.jewelryInfoImage?.node?.sourceUrl || fallback.jewelryInfoImage || "",
      imageAlt: String(acf?.jewelryInfoImage?.node?.altText ?? "").trim() || fallback.jewelryInfoImageAlt || "",
    },
    stepSection: {
      show: showStepSection,
      steps: steps,
    },
    centerVideo: {
      show: showCenterVideoSection,
      video:
        String(globalAcf?.centerVideo ?? "").trim() ||
        String(acf?.centerVideo ?? "").trim() ||
        String(fallback.centerVideo ?? "").trim() ||
        "",
    },
    ourAchievements: {
      show: showOurAchievementsSection,
      title: String(acf?.ourAchievementsTitle ?? "").trim() || fallback.ourAchievementsTitle || "",
      subHeading: String(acf?.ourAchievementsSubHeading ?? "").trim() || fallback.ourAchievementsSubHeading || "",
      buttonTitle: String(acf?.ourAchievementsButtonTitle ?? "").trim() || fallback.ourAchievementsButtonTitle || "",
      buttonLink: String(acf?.ourAchievementsButtonLink ?? "").trim() || fallback.ourAchievementsButtonLink || "",
      items: achievementsPosts.map((post) => ({
        href: String(post?.uri ?? "").trim(),
        title: String(post?.title ?? "").trim(),
        image: String(post?.featuredImage?.node?.sourceUrl ?? "").trim(),
        imageAlt: String(post?.featuredImage?.node?.altText ?? "").trim(),
      })).filter((post) => post.href || post.title || post.image),
    },
    bonnotHouseParis: {
      show: showBonnotHouseParisSection,
      image: acf?.bonnotHouseParisImage?.node?.sourceUrl || fallback.bonnotHouseParisImage || "",
      imageAlt: String(acf?.bonnotHouseParisImage?.node?.altText ?? "").trim() || fallback.bonnotHouseParisImageAlt || "",
      title: String(acf?.bonnotHouseParisTitle ?? "").trim() || fallback.bonnotHouseParisTitle || "",
      description: String(acf?.bonnotHouseParisDescription ?? "").trim() || fallback.bonnotHouseParisDescription || "",
      highlightedText: String(acf?.bonnotHouseParisHighlightedText ?? "").trim() || fallback.bonnotHouseParisHighlightedText || "",
      buttonTitle: String(acf?.bonnotHouseParisButtonTitle ?? "").trim() || fallback.bonnotHouseParisButtonTitle || "",
      buttonLink: String(acf?.bonnotHouseParisButtonLink ?? "").trim() || fallback.bonnotHouseParisButtonLink || "",
    },
    ourKnowSection: {
      show: showOurKnowSection,
      leftImage:
        String(acf?.ourKnowLeftImage?.node?.sourceUrl ?? "").trim() ||
        String(fallback.ourKnowLeftImage ?? "").trim() ||
        "",
      leftImageAlt:
        String(acf?.ourKnowLeftImage?.node?.altText ?? "").trim() ||
        String(fallback.ourKnowLeftImageAlt ?? "").trim() ||
        "",
      leftMasterImage:
        String(acf?.ourKnowLeftMasterImage?.node?.sourceUrl ?? "").trim() ||
        String(fallback.ourKnowLeftMasterImage ?? "").trim() ||
        "",
      leftMasterImageAlt:
        String(acf?.ourKnowLeftMasterImage?.node?.altText ?? "").trim() ||
        String(fallback.ourKnowLeftMasterImageAlt ?? "").trim() ||
        "",
      title: String(acf?.ourKnowTitle ?? "").trim() || fallback.ourKnowTitle || "",
      description: String(acf?.ourKnowDescription ?? "").trim() || fallback.ourKnowDescription || "",
      contentList: (acf?.ourKnowContentList || fallback.ourKnowContentList || [])
        .map((item) => String(item?.ourKnowContent ?? "").trim())
        .filter(Boolean),
      subHeading: String(acf?.ourKnowSubHeading ?? "").trim() || fallback.ourKnowSubHeading || "",
      buttonTitle: String(acf?.ourKnowButtonTitle ?? "").trim() || fallback.ourKnowButtonTitle || "",
      buttonLink: String(acf?.ourKnowButtonLink ?? "").trim() || fallback.ourKnowButtonLink || "",
    },
    certificationBySection: {
      show: showCertificationBySection,
      image: acf?.certificationByImage?.node?.sourceUrl || fallback.certificationByImage || "",
      imageAlt: String(acf?.certificationByImage?.node?.altText ?? "").trim() || fallback.certificationByImageAlt || "",
      title: String(acf?.certificationByTitle ?? "").trim() || fallback.certificationByTitle || "",
      subHeading: String(acf?.certificationBySubHeading ?? "").trim() || fallback.certificationBySubHeading || "",
      description: String(acf?.certificationByDescription ?? "").trim() || fallback.certificationByDescription || "",
      buttonTitle: String(acf?.certificationByButtonTitle ?? "").trim() || fallback.certificationByButtonTitle || "",
      buttonLink: String(acf?.certificationByButtonLink ?? "").trim() || fallback.certificationByButtonLink || "",
    },
    faqSection: {
      show: showFaqSection,
      faqDetails: (acf?.faqDetails || fallback.faqDetails || [])
        .map((item) => ({
          faqTitle: String(item?.faqTitle ?? "").trim(),
          faqDescription: String(item?.faqDescription ?? "").trim(),
          faqButtonLinkTitle: String(item?.faqButtonLinkTitle ?? "").trim(),
          faqButtonLink: String(item?.faqButtonLink ?? "").trim(),
          faqDetailsImage: String(item?.faqDetailsImage?.node?.sourceUrl ?? "").trim() || fallback.faqDetailsImage || "",
          faqDetailsImageAlt: String(item?.faqDetailsImage?.node?.altText ?? "").trim() || fallback.faqDetailsImageAlt || "",
        })).filter((item) => item.faqTitle || item.faqDescription || item.faqButtonLinkTitle || item.faqButtonLink || item.faqDetailsImage),
    },
    testimonialsSection: {
      show: showTestimonialsSection,
    },
  };
}
