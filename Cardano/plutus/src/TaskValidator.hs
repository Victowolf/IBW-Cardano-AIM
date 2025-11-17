{-# LANGUAGE DataKinds #-}
{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE OverloadedStrings #-}

module TaskValidator where

import           Plutus.V2.Ledger.Api
import           Plutus.V2.Ledger.Contexts
import qualified PlutusTx
import           PlutusTx.Prelude         hiding (Semigroup(..), unless)

-- Datum: store allowed PubKeyHash as raw bytes (BuiltinByteString)
-- Validator expects datum = bytes of the allowed PubKeyHash.
{-# INLINABLE mkValidator #-}
mkValidator :: BuiltinByteString -> BuiltinData -> ScriptContext -> Bool
mkValidator datum _ ctx =
    traceIfFalse "output does not return to allowed pubkey hash" check
  where
    info :: TxInfo
    info = scriptContextTxInfo ctx

    allowed :: PubKeyHash
    allowed = PubKeyHash datum

    -- check any tx output pays to the allowed pubkeyhash
    check :: Bool
    check = any outputToAllowed (txInfoOutputs info)

    outputToAllowed :: TxOut -> Bool
    outputToAllowed o = case txOutAddress o of
        Address (PubKeyCredential pkh) _ -> pkh == allowed
        _                                -> False

-- Boilerplate
{-# INLINABLE wrap #-}
wrap :: BuiltinData -> BuiltinData -> BuiltinData -> ()
wrap = mkUntypedValidator mkValidator

validator :: Validator
validator = mkValidatorScript $$(PlutusTx.compile [|| wrap ||])
