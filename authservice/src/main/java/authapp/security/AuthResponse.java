package authapp.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.io.Serializable;

/**
 * Custom response to user request for a token
 * This response will be send only if token is created
 *
 * @author WolfAlexander nikal@kth.se
 */
@Getter
@AllArgsConstructor
public class AuthResponse implements Serializable{
    private static final long serialVersionUID = 9104047414186210425L;

    private final String token;
}
