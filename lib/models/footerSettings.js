// lib/models/footerSettings.js
import mongoose from 'mongoose';

const FooterSettingsSchema = new mongoose.Schema({
  orgName: String,

  quickLinks: [
    {
      label: String,
      path: String,
    },
  ],
  termsLinks: [
    {
      label: String,
      path: String,
    },
  ],
  volunteering: {
    heading: String,
    description: String,
    linkLabel: String,
    linkPath: String,
  },
  socialLinks: {
    facebook: String,
    instagram: String,
    linkedin: String,
    twitter: String,
  },
  copyrightText: {
    type: String,
    default: `All rights reserved - © ${new Date().getFullYear()}`
  },
}, { timestamps: true });

export default mongoose.models.FooterSettings || mongoose.model('FooterSettings', FooterSettingsSchema);
