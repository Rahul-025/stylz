import { useState, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import PulseLoader from "react-spinners/PulseLoader";

// Utility Imports
import {
  createUserDocFromAuth,
  createAuthUserFromEmailAndPassword,
} from "../../utilities/firebase/firebase.util";

import { useClickOutside } from "../../utilities/useClickOutside";

import { ErrorToastEmitter } from "../../utilities/toaster/toast.util";

// Images and Icons
import { GiCrossedBones } from "react-icons/gi";

// Redux
import { selectUserLoggedIn } from "../../store/user/user.selectors";
import { setUserLoggedIn } from "../../store/user/user.slice";

//Components
import FormInput from "../formInput/FormInput.component";

//Styles
import { HeadingH2, ButtonDarkBlue, Div } from "../../commonStyles";
import {
  Form,
  Span,
  ButtonContainer,
  SignUpFormContainer,
  SignUpContainer,
  XIconContainer,
  FlexDivSignUp,
} from "./SignUp.styles";

const defaultFormFields = {
  displayName: "",
  email: "",
  passsword: "",
  confirmPassword: "",
};

const SignUp = ({ setModel }) => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, displayName, password, confirmPassword } = formFields;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signUpRef = useRef(null);

  const userLoggedIn = useSelector(selectUserLoggedIn);

  useClickOutside(signUpRef, () => setModel(false));

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(setUserLoggedIn(true));

    if (password !== confirmPassword) {
      alert("Passwords do not matcch");
    }
    try {
      const { user } = await createAuthUserFromEmailAndPassword(
        email,
        password
      );
      await createUserDocFromAuth(user, { displayName });
      setFormFields(defaultFormFields);
      dispatch(setUserLoggedIn(false));
      navigate("/");
    } catch (error) {
      dispatch(setUserLoggedIn(false));
      ErrorToastEmitter(error.code);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleExit = () => {
    setModel((p) => !p);
  };

  return (
    <SignUpContainer>
      <SignUpFormContainer ref={signUpRef}>
        <XIconContainer onClick={handleExit}>
          <GiCrossedBones size={20} color="var(--navbar-color)" />
        </XIconContainer>
        <Form onSubmit={handleSubmit}>
          <HeadingH2>Sign Up</HeadingH2>
          <FlexDivSignUp>
            <FormInput
              label="Display Name"
              inputOptions={{
                name: "displayName",
                value: displayName,
                onChange: handleChange,
              }}
            />
            <FormInput
              label="Email"
              inputOptions={{
                name: "email",
                value: email,
                type: "email",
                onChange: handleChange,
              }}
            />
          </FlexDivSignUp>
          <FlexDivSignUp>
            <FormInput
              label="Password"
              inputOptions={{
                name: "password",
                value: password,
                type: "password",
                onChange: handleChange,
              }}
            />
            <FormInput
              label="Confirm Password"
              inputOptions={{
                name: "confirmPassword",
                value: confirmPassword,
                type: "password",
                onChange: handleChange,
              }}
            />
          </FlexDivSignUp>
        </Form>
        <ButtonContainer style={{ marginTop: "2rem" }}>
          <ButtonDarkBlue type="submit" onClick={handleSubmit}>
            {userLoggedIn ? (
              <PulseLoader size={10} color={"var(--body-yellow)"} />
            ) : (
              "Sign Up"
            )}
          </ButtonDarkBlue>
        </ButtonContainer>
        <Div>
          Already registered?
          <Span onClick={handleExit}> Sign In</Span>
        </Div>
      </SignUpFormContainer>
    </SignUpContainer>
  );
};

export default SignUp;
