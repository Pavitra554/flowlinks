import * as fcl from "@onflow/fcl";
import { FlowLinkType } from "./types";
import { checkIsInitialized } from "./scripts";
import toast from "react-hot-toast";

export const INITIALIZE_ACCOUNT = `
import FlowLink from 0xFlowLink
import NonFungibleToken from 0xNonFungibleToken

transaction() {
    prepare(account: AuthAccount) {
      let cap = account.getCapability<&FlowLink.Collection{NonFungibleToken.CollectionPublic,FlowLink.CollectionPublic}>(FlowLink.CollectionPublicPath).check()
      if cap {
        return 
      }
      account.save<@NonFungibleToken.Collection>(<- FlowLink.createEmptyCollection(),to: FlowLink.CollectionStoragePath)
      account.link<&FlowLink.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, FlowLink.CollectionPublic}>(FlowLink.CollectionPublicPath, target: FlowLink.CollectionStoragePath)
      account.link<&FlowLink.Collection>(/private/FlowLinkCollection, target: FlowLink.CollectionStoragePath)
    }

    execute {}
}
`;
export async function initializeAccount() {
  const txId = await fcl.mutate({
    cadence: INITIALIZE_ACCOUNT,
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 50,
  });
  const tx = await fcl.tx(txId).onceSealed();
  return tx;
}

const MINT_NFT = `
import FlowLink from 0xFlowLink
import NonFungibleToken from 0xNonFungibleToken
import FungibleToken from 0xFungibleToken

transaction(domainName:String,displayName:String,title:String,bio:String,avatar:String,cover:String,socialLinks:{String:String},otherLinks:[{String:String}],styles:{String:String}){
  let nftReceiver: &{NonFungibleToken.CollectionPublic}
  let vault: @FungibleToken.Vault
  
  prepare(account:AuthAccount){
    self.nftReceiver = account.getCapability(FlowLink.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>() ?? panic("Could not get receiver refernce to the NFT collection")
    let vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("Could not borrow Flow token vault reference")
    self.vault <- vaultRef.withdraw(amount:1.000)
  }
  
  execute {
    FlowLink.mintFlowLink(domainName:domainName,displayName:displayName,title:title,bio:bio,avatar:avatar,cover:cover,socialLinks:socialLinks,otherLinks:otherLinks,styles:styles,recipient:self.nftReceiver,feeTokens:<- self.vault) 
  }
}
 `;

export type MintProps = {
  domainName: string;
  displayName: string;
  title: string;
  bio: string;
  avatar: string;
  cover: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
    github?: string;
    mail?: string;
  };
  otherLinks: { title: string; href: string }[];
  styles: {
    avatar: string;
    background: string;
    card: string;
    theme: string;
  };
};

export const mintNFT = async (receiver: string, data: FlowLinkType) => {
  if (!receiver) throw new Error("address not found");
  const isInit = await checkIsInitialized(receiver);
  if (!isInit) {
    const initTx = await initializeAccount();
  }
  const _socialLinks = Object.keys(data.socialLinks).map((item: string) => ({
    key: item,
    value: data.socialLinks[item],
  }));
  const _styles = Object.keys(data.styles).map((item: string) => ({
    key: item,
    value: data.styles[item],
  }));
  const _otherLinks = data.otherLinks.map((link) =>
    Object.keys(link).map((item: string) => ({ key: item, value: link[item] }))
  );
  try {
    const txId = await fcl.mutate({
      cadence: MINT_NFT,
      args: (arg: any, t: any) => {
        const args = [
          arg(data.domainName, t.String),
          arg(data.displayName, t.String),
          arg(data.title, t.String),
          arg(data.bio, t.String),
          arg(data.avatar, t.String),
          arg(data.cover, t.String),
          arg(_socialLinks, t.Dictionary({ key: t.String, value: t.String })),
          arg(
            _otherLinks,
            t.Array(t.Dictionary({ key: t.String, value: t.String }))
          ),
          arg(_styles, t.Dictionary({ key: t.String, value: t.String })),
        ];
        return args;
      },
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 1000,
    });
    const tx = await fcl.tx(txId).onceSealed();
    return tx;
  } catch (err) {
    toast(JSON.stringify(err));
  }
};

export const EDIT_NFT = `
import FlowLink from 0xFlowLink
import NonFungibleToken from 0xNonFungibleToken

transaction(id:UInt64,displayName:String,title:String,bio:String,avatar:String,cover:String,socialLinks:{String:String},otherLinks:[{String:String}],styles:{String:String}) {
    var nft: &FlowLink.NFT

    prepare(account: AuthAccount) {
      let collection = account.getCapability(FlowLink.CollectionPublicPath).borrow<&FlowLink.Collection{FlowLink.CollectionPrivate}>() ?? panic("Could not get receiver refernce to the NFT collection")
      self.nft = collection.borrowFlowLinkPrivate(id:id)
    }

    execute {
      self.nft.setDisplayName(displayName:displayName)
      self.nft.setTitle(title: title)
      self.nft.setAvatar(avatar: avatar)
      self.nft.setBio(bio: bio)
      self.nft.setCover(cover: cover)
      self.nft.setOtherLinks(otherLinks: otherLinks)
      self.nft.setSocialLinks(socialLinks: socialLinks)
      self.nft.setStyles(styles: styles)
    }
}
`;
export const editNFT = async () => {
  // replace data
  const data: Omit<FlowLinkType, "domainName"> = {
    displayName: "Raspberry",
    title: "Cool fruit",
    bio: "Hello i am raspberry",
    avatar:
      "https://avatars.githubusercontent.com/u/26627776?s=400&u=cd1b01b3ff21747c214b0b4b0d2a6b9bfef39695&v=4",
    cover:
      "https://pbs.twimg.com/profile_banners/936173957262094336/1670725794/1500x500",
    socialLinks: {
      github: "https://github.com/adarshzpatel/rash",
      linkedIn: "https://www.linkedin.com/in/rash/",
      twitter: "https://www.linkedin.com/in/rash/",
    },
    otherLinks: [{ title: "Website", href: "https://flowlinks.vercel.app" }],
    styles: {
      avatar: "rounded",
      background: "#000",
      card: "rounded",
      theme: "#e5e5e5 #a3a3a3 #404040 #262626",
    },
  };
  const _socialLinks = Object.keys(data.socialLinks).map((item: string) => ({
    key: item,
    value: data.socialLinks[item],
  }));
  const _styles = Object.keys(data.styles).map((item: string) => ({
    key: item,
    value: data.styles[item],
  }));
  const _otherLinks = data.otherLinks.map((link) =>
    Object.keys(link).map((item: string) => ({ key: item, value: link[item] }))
  );

  try {
    const txId = await fcl.mutate({
      cadence: EDIT_NFT,
      args: (arg: any, t: any) => {
        const args = [
          arg(0, t.UInt64),
          arg(data.displayName, t.String),
          arg(data.title, t.String),
          arg(data.bio, t.String),
          arg(data.avatar, t.String),
          arg(data.cover, t.String),
          arg(_socialLinks, t.Dictionary({ key: t.String, value: t.String })),
          arg(
            _otherLinks,
            t.Array(t.Dictionary({ key: t.String, value: t.String }))
          ),
          arg(_styles, t.Dictionary({ key: t.String, value: t.String })),
        ];
        return args;
      },
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 1000,
    });
    const tx = await fcl.tx(txId).onceSealed();
    return tx;
  } catch (err) {
    console.error(err);
  }
};
