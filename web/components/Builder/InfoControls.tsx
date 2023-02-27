import React, { useEffect, useState } from "react";
import AddLinkModal from "./AddLinkModal";
import { Accordion } from "@mantine/core";
import { PickerInline } from "filestack-react-18";

//React Icons
import { TextInput } from "@mantine/core";
import { Textarea } from "@mantine/core";
import { FiLink, FiX } from "react-icons/fi";
import {
  TbBrandGithub,
  TbBrandLinkedin,
  TbBrandTwitter,
  TbBrandYoutube,
  TbMail,
} from "react-icons/tb";
import { SiInstagram } from "react-icons/si";

import { useControls } from "../../store/useControls";
import { useDebouncedState } from "@mantine/hooks";
import { checkIsAvailable } from "../../flow/scripts";
import Button from "../ui/Button";

//TODO

// -- add accordion
// -- social media links

// Other links
// -- list of already added links
// add new link button -> Modal -> input title and href , add link btn -> append to links list

// spread operator , destructuring , promise ,async await

const InfoControls = () => {
  const {
    displayName,
    title,
    bio,
    twitter,
    github,
    linkedin,
    instagram,
    youtube,
    gmail,
    otherLinks,
    setTwitter,
    setGithub,
    setLinkedin,
    setInstagram,
    setYoutube,
    setGmail,
    setDisplayName,
    setUserName,
    setTitle,
    setBio,
    deleteOtherLink,
    setAvatar,
    setCover,
  } = useControls();

  const [openNewLinkModal, setOpenNewLinkModal] = useState<boolean>(false);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [domainName, setDomainName] = useDebouncedState("", 200);
  const [openAvatarUpload, setOpenAvatarUpload] = useState<boolean>(false);
  const [openCoverUpload, setOpenCoverUpload] = useState<boolean>(false);
  useEffect(() => {
    const check = async () => {
      const res = await checkIsAvailable(domainName);
      if (!res) setDomainError("Already Claimed");
      else setDomainError("");
    };

    if (domainName) {
      check();
    }
  }, [domainName]);

  return (
    <>
      <div className="pt-8 overflow-y-scroll  pr-8 flex flex-col select-none ease-linear duration-150">
        {/*Names */}
        <Accordion variant="separated" defaultValue="general">
          <Accordion.Item value="general">
            <Accordion.Control>General Info</Accordion.Control>
            <Accordion.Panel>
              <div className="space-y-4">
                <TextInput
                  label="Display Name"
                  placeholder="Enter display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  withAsterisk
                />

                <TextInput
                  label="Enter domain name"
                  placeholder="Enter domain name"
                  defaultValue={domainName}
                  description="Should not include !@#$%^&*()<>? ./"
                  onChange={(e) => {
                    setDomainName(e.target.value);
                    setUserName(e.target.value);
                  }}
                  withAsterisk
                  error={domainError}
                />
                <TextInput
                  label="Title"
                  placeholder="Eg. Full Stack Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  withAsterisk
                />
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Enter bio"
                  label="Bio"
                  withAsterisk
                />
                <div className="flex gap-4">
                  <Button
                    disabled={openCoverUpload}
                    onClick={() => setOpenAvatarUpload((state) => !state)}
                  >
                    {openAvatarUpload ? "Cancel" : "Upload Avatar"}
                  </Button>
                  <Button
                    disabled={openAvatarUpload}
                    onClick={() => setOpenCoverUpload((state) => !state)}
                  >
                    {openCoverUpload ? "Cancel" : "Upload Cover"}
                  </Button>
                </div>

                {(openAvatarUpload || openCoverUpload) && (
                  <PickerInline
                    apikey={"AZHWiPxaTTyi03E1f5CIiz"}
                    onUploadDone={(res: any) => {
                      const file = res.filesUploaded[0];
                      const url = file.url;
                      if (openAvatarUpload) {
                        setAvatar(url);
                        setOpenAvatarUpload(false);
                      }
                      if (openCoverUpload) {
                        setCover(url);
                        setOpenCoverUpload(false);
                      }
                    }}
                    onError={() => {
                      setOpenAvatarUpload(false);
                      setOpenCoverUpload(false);
                    }}
                  />
                )}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
          {/*Social Links*/}
          <Accordion.Item value="socialLinks">
            <Accordion.Control>Social Links</Accordion.Control>
            <Accordion.Panel>
              <div className="space-y-4">
                <TextInput
                  icon={<TbBrandTwitter />}
                  label="Twitter"
                  placeholder="Paste your twitter profile url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
                <TextInput
                  icon={<TbBrandGithub />}
                  label="GitHub"
                  placeholder="Paste your github profile url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
                <TextInput
                  icon={<TbBrandLinkedin />}
                  label="LinkedIn"
                  placeholder="Paste your linkedin profile url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
                <TextInput
                  icon={<SiInstagram />}
                  label="Instagram"
                  placeholder="Paste your instagram profile url "
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
                <TextInput
                  icon={<TbBrandYoutube />}
                  label="YouTube"
                  placeholder="Paste your YouTube channel url"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                />
                <TextInput
                  icon={<TbMail />}
                  label="Email"
                  placeholder="Paste your email"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                />
              </div>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="otherLinks">
            <Accordion.Control>Other Links</Accordion.Control>
            <Accordion.Panel>
              <div className="flex flex-col gap-4">
                {otherLinks?.map((item) => (
                  <div
                    key={`${item?.href}`}
                    className="flex flex-row space-x-2"
                  >
                    <div className="w-full flex justify-between items-center text-gray-50/70 hover:brightness-125 ease-linear duration-150 active:scale-95 flex-row bg-gray-800/90 p-2 px-3 rounded-md">
                      <div>{item?.title ?? title}</div>
                      <div>
                        <FiLink />
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => deleteOtherLink(item)}
                    >
                      <FiX />
                    </Button>
                  </div>
                ))}
                <Button onClick={() => setOpenNewLinkModal(true)}>
                  Add New Link
                </Button>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
      <AddLinkModal
        opened={openNewLinkModal}
        onClose={() => setOpenNewLinkModal(false)}
      />
    </>
  );
};

export default InfoControls;
