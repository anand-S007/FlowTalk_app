import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react"
import toast from "react-hot-toast"

import { completeOnboarding } from "../lib/api.js"
import useAuthUser from "../hooks/useAuthUser.js"
import { validateOnboard } from "../validations/userValidations.js"
import { LANGUAGES } from "../constants/index.js"
import { useFormErrors } from "../hooks/useFormErrors.js"


const OnboardPage = () => {
  const { authUser } = useAuthUser()
  const queryClient = useQueryClient()

  // HOOK
  const [showModal, setShowModal] = useState(false);
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  // CUSTOM HOOK FOR HANDLING ERRORS
  const { error, setErrors, clearErrors } = useFormErrors()

  const [formState, setFormState] = useState({
    fullname: authUser?.fullname || '',
    bio: authUser?.bio || '',
    nativeLanguage: authUser?.nativeLanguage || '',
    learningLanguage: authUser?.learningLanguage || '',
    location: authUser?.location || '',
    profilePic: selectedAvatar ? selectedAvatar : authUser?.profilePic
  })


  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success('User onboarded successfully');
      console.log('onboarding success');

      queryClient.invalidateQueries({ queryKey: ['userAuth'] })
    },
    onError: (error) => {
      console.log(error);
    }
  })

  // WHENEVER SELECTEDAVATAR CHANGES, UPDATE FORMSTATE
  useEffect(() => {
    if (selectedAvatar) {
      setFormState(prev => ({ ...prev, profilePic: selectedAvatar }));
    }
  }, [selectedAvatar]);

  // SUBMIT BUTTON HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateOnboard(formState);

    if (validation.error) {
      setErrors(validation.message);
      return;
    }

    clearErrors();
    onboardingMutation(formState);
  };




  // GENERATE RANDOM AVATAR
  const chooseAvatar = async (e) => {
    e.preventDefault()
    let avatarOf = authUser.gender === "male" ? "boy" : "girl";

    setLoading(true)
    setShowModal(true);

    // generate multiple random avatars
    const newAvatars = Array.from({ length: 6 }, () =>
      `https://avatar.iran.liara.run/public/${avatarOf}?id=${Math.floor(Math.random() * 1000)}`
    );

    // Preload all images
    await Promise.all(
      newAvatars.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = resolve; // handle failed loads gracefully
          })
      )
    );

    setAvatars(newAvatars);
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-300 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl text-center sm:text-3xl p-6 sm:p-8">Complete Your Profile</h1>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6" >

            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMGAE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {
                  formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-12 text-base-content opacity-40" />
                    </div>
                  )
                }
              </div>

              {/* GENERATE RANDOM AVATAR */}
              <div className="flex items-center gap-2">
                <button type="button" onClick={chooseAvatar} className="btn btn-accent">
                  <ShuffleIcon className="size-4 mr-2" />
                  Choose Your Avatar
                </button>
              </div>

              {showModal && (
                <dialog className="modal modal-open" method='modal'>
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Choose Your Avatar</h3>

                    {loading ? (
                      <>
                        <div className="flex justify-center items-center py-10">
                          <LoaderIcon className="size-12 animate-spin text-primary" />
                        </div>
                        <div className="modal-action">
                          <button className="btn"
                            onClick={() => {
                              setShowModal(false)
                              setSelectedAvatar(null)
                            }}>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {avatars.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt="avatar"
                              className={`cursor-pointer rounded-full border-4 ${selectedAvatar === url ? "border-primary" : "border-transparent"
                                }`}
                              onClick={() => setSelectedAvatar(url)}
                            />
                          ))}
                        </div>

                        <div className="modal-action">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              console.log("Avatar chosen:", selectedAvatar);
                              setFormState({ ...formState, profilePic: selectedAvatar })
                              setShowModal(false);
                            }}
                            disabled={!selectedAvatar}
                          >
                            Confirm
                          </button>
                          <button className="btn"
                            onClick={() => {
                              setShowModal(false)
                              setSelectedAvatar(null)
                            }}>
                            Cancel
                          </button>
                        </div>
                      </>
                    )}

                  </div>
                </dialog>
              )}

            </div>

            {error.hasError && (
              <div role="alert" className="bg-red border border-red-400 text-red-800 p-4 rounded-md mb-4">
                <strong className="block mb-2">Please fix the following errors:</strong>
                <ul className="list-disc list-inside space-y-1">
                  {error.message.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullname"
                value={formState.fullname}
                onChange={(e) => setFormState({ ...formState, fullname: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <input
                type="text"
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={e => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>Select Your Native Language</option>
                  {LANGUAGES.map((language) => (
                    <option key={`native-${language}`} value={language.toLowerCase()}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARINING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={e => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>
                    Select Your Learning Language
                  </option>
                  {LANGUAGES.map((language) => (
                    formState.nativeLanguage !== language && (
                      <option key={`learning-${language}`} value={language.toLowerCase()}>
                        {language}
                      </option>
                    )
                  ))}
                </select>
              </div>

              {/* LOCATION */}
              <div className="form-control">
                <label className="label">
                  <span className="label label-text">
                    Location
                  </span>
                </label>
                <div className="relative">
                  <MapPinIcon
                    className="absolute top-1/2 
                      transfrom -translate-y-1/2 left-3 
                      size-5 text-base-content opacity-70"/>
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={e => setFormState({ ...formState, location: e.target.value })}
                    className="input input-bordered w-full pl-10"
                    placeholder="City, Country"
                  />
                </div>
              </div>

            </div>
            {/* SUBMIT BUTTON */}
            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardPage