import { useEffect, useState } from "react"
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, Locate } from "lucide-react"

import useAuthUser from "../hooks/useAuthUser.js"
import { bioValidate, nameValidate } from "../validations/userValidations.js"
import { LANGUAGES } from "../constants/index.js"
import { useOnboardUser } from "../hooks/useOnboardUser.js"
import Alert from "@mui/material/Alert"
import useSignoutUser from "../hooks/useSignoutUser.js"
import { getCurrentLocation } from "../lib/locationApi.js"
import axios from "axios"


const OnboardPage = () => {
  const { authUser } = useAuthUser()

  // HOOK
  const [showModal, setShowModal] = useState(false);
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  // CUSTOM HOOK FOR HANDLING ERRORS
  const [errors, setErrors] = useState([])
  const [formState, setFormState] = useState({
    fullname: authUser?.fullname || '',
    bio: authUser?.bio || '',
    nativeLanguage: authUser?.nativeLanguage || '',
    learningLanguage: authUser?.learningLanguage || '',
    location: authUser?.location || '',
    profilePic: authUser?.profilePic ? authUser?.profilePic : selectedAvatar
  })

  // HANDLE INPUT
  const handleInput = (e) => {
    setErrors([])
    const { name, value } = e.target
    console.log('input field = ', name, 'input value = ', value);

    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  // FORM VALIDATION
  const validateForm = () => {
    const validationErrors = []

    // NAME VALIDATION
    const validatedName = nameValidate(formState?.fullname)
    if (validatedName.error) validationErrors.push(...validatedName.message)

    // BIO VALIDATION
    const validatedBio = bioValidate(formState?.bio)
    if (validatedBio.error) validationErrors.push(...validatedBio.message)

    return validationErrors
  }


  // WHENEVER SELECTEDAVATAR CHANGES, UPDATE FORMSTATE
  useEffect(() => {
    if (selectedAvatar) {
      console.log('selectedAvatar = ', selectedAvatar);

      setFormState(prev => ({ ...prev, profilePic: selectedAvatar }));
    }
  }, [selectedAvatar]);

  // GENERATE AVATAR
  const chooseAvatar = async (e) => {
    e.preventDefault();
    let avatarOf = authUser.gender === "male" ? "boy" : "girl";

    setLoading(true);
    setShowModal(true);

    // generate multiple random avatars
    const newAvatars = Array.from({ length: 6 }, () =>
      `https://avatar.iran.liara.run/public/${avatarOf}?id=${Math.floor(Math.random() * 1000)}`
    );

    // Instead of waiting for all images, set them immediately
    setAvatars(newAvatars);
    setLoading(false);
  };

  // ONBOARDING QUERY
  const { onboardingMutation, isPending } = useOnboardUser()

  // SIGN OUT QUERY
  const { signoutUser } = useSignoutUser()

  const handleSignout = async (e) => {

    e.preventDefault()
    try {
      await signoutUser()
    } catch (error) {
      console.log(error);
    }
  }

  // GET CURRENT LOCATION
  const detectLocation = async () => {
    setLoading(true)
    try {
      // GETTING LATITUTDE AND LONGITUDE
      const res = await getCurrentLocation();

      // "BIG DATA CLOUD" API ENDPOINT
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${res.lat}&longitude=${res.lng}&localityLanguage=en`

      // REQUEST FOR FETCH CURRENT LOCATION
      const response = await axios.get(url);
      // const data = response.data
      console.log(response.data);

      const { city, principalSubdivision, countryName } = response.data;
      setFormState((prev) => ({
        ...prev,
        location: `${city}, ${principalSubdivision}, ${countryName}`
      }))

      setLoading(false)
    } catch (err) {
      setErrors([err.message]);
    }
  };

  // SUBMIT BUTTON HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return
      }

      await onboardingMutation(formState);
    } catch (error) {
      console.log(error);
      setErrors([error?.response?.data?.message || error.message || "Something went wrong"]);
    }

  };


  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-300 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">

          {/* SIGN OUT BUTTON */}
          <div className="flex items-end justify-end">
            <button
              onClick={handleSignout}
              className="w-36 btn btn-primary btn-outline">
              Sign out
            </button>
          </div>

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

            {/* ERROR MESSAGE */}
            {errors.length > 0 && (
              <Alert className='z-10' variant='filled' severity="error">
                <ul className='list-disc list-inside'>
                  {errors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </Alert>
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
                onChange={handleInput}
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
                onChange={handleInput}
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
                  onChange={(e) => {
                    const selectedNative = e.target.value;
                    setFormState((prev) => ({
                      ...prev,
                      nativeLanguage: selectedNative,
                      // Reset learning language if it conflicts
                      learningLanguage:
                        prev.learningLanguage === selectedNative ? "" : prev.learningLanguage,
                    }));
                  }}
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

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={handleInput}
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>Select Your Learning Language</option>
                  {LANGUAGES.filter(
                    (language) => language.toLowerCase() !== formState.nativeLanguage
                  ).map((language) => (
                    <option key={`learning-${language}`} value={language.toLowerCase()}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
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
                  readOnly
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
              <button
                type="button"
                onClick={detectLocation}
                className="
                      flex items-center justify-end mt-3 gap-1
                      link-primary cursor-pointer "
              >
                <Locate className="w-5 h-5" />
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Finding location...
                  </>
                ) : (
                  "Detect my location"
                )}
              </button>
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