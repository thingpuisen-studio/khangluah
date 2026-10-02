import { siteConfig } from './siteConfig';
export type { SocialLinkConfig as SocialLink } from './siteConfig';

export const linkhubConfig = {
  headline: siteConfig.pages.socials.headline,
  subheadline: siteConfig.pages.socials.subheadline,
  whatsappNumber: "+91",
  email: siteConfig.author.email,
  orcid: siteConfig.author.orcid,
};

export const socialLinks = siteConfig.socialLinks;
