<?php

namespace fibe\CommunityBundle\Services;

use fibe\CommunityBundle\Entity\Person;
use fibe\RestBundle\Services\AbstractBusinessService;
use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Model\UserManagerInterface;
use FOS\UserBundle\Util\TokenGeneratorInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\SecurityContextInterface;

/**
 * Class MainEventService
 * @package fibe\EventBundle\Services
 */
class PersonService extends AbstractBusinessService
{

  protected $securityContext;
  protected $userManager;
  protected $tokenGenerator;
  protected $mailer;
  protected $session;

  public function __construct(SecurityContextInterface $securityContext, UserManagerInterface $userManager, TokenGeneratorInterface $tokenGenerator, MailManager $mailer, SessionInterface $session)
  {
    $this->securityContext = $securityContext;
    $this->userManager = $userManager;
    $this->tokenGenerator = $tokenGenerator;
    $this->mailer = $mailer;
    $this->session = $session;
  }

  /**
   * create an user linked to the person and send a confirmation mail
   * @param Person $person
   *
   * @throws \Doctrine\DBAL\DBALException when email or username is already in use
   */
  public function post(Person $person)
  {
    $email = $person->getEmail();
    $randomPwd = substr(base_convert(bin2hex(hash('sha256', uniqid(mt_rand(), true), true)), 16, 36), 0, 12);

    /** @var \fibe\SecurityBundle\Entity\User $newUser */
    $newUser = $this->userManager->createUser();
    $newUser->setRandomPwd(true);
    $newUser->setUsername($email);
    $newUser->setEmail($email);
    $newUser->setPlainPassword($randomPwd);
    $newUser->setEnabled(false);
    $newUser->setConfirmationToken($this->tokenGenerator->generateToken());
    $person->setUser($newUser);
    $this->userManager->updateUser($newUser);

    $this->session->set('_locale', 'fr_FR');
    $this->mailer->sendConfirmationEmailMessage($newUser);
  }

  /**
   * if the account isn't activated, send a new mail
   * @param Person $person
   *
   * @throws \Doctrine\DBAL\DBALException when email or username is already in use
   * @throws \Symfony\Component\Security\Core\Exception\AccessDeniedException
   */
  public function put(Person $person)
  {
    $user = $person->getUser();

    //nobody but the user himself can change his profile while his account is enabled
    //TODO : manage this with ACL
    //TODO : manage this with ACL
    //!== $this->securityContext->getToken()->getUser()->getId()
    //()
    if ($user->isEnabled()
      && $this->securityContext->getToken()->getUser() instanceof UserInterface
      && $user->getId() !== $this->securityContext->getToken()->getUser()->getId()
    )
    {
      throw new AccessDeniedException('This person is linked to a real user account');
    }
    else
    {
      if ($oldMail = $this->isDirty($person, 'email'))
      {
        $user->setEmail($person->getEmail());
        $this->userManager->updateUser($user);

        $user->setConfirmationToken($this->tokenGenerator->generateToken());
        $this->userManager->updateUser($user);
        $this->mailer->sendConfirmationEmailMessage($user);
        //todo : send a mail to the old account to inform that the confirmation link is no longer valid !
      }
    }
  }

  /**
   * if the account isn't activated, send a new mail
   * @param Person $person
   *
   * @throws \Doctrine\DBAL\DBALException when email or username is already in use
   * @throws \Symfony\Component\Security\Core\Exception\AccessDeniedException
   */
  public function delete(Person $person)
  {
    $user = $person->getUser();
    if ($user->isEnabled())
    {
      throw new AccessDeniedException('This person is linked to a real user account');
    }
    $user->setPerson(null);
    $person->setUser(null);
    $this->userManager->deleteUser($user);
  }
}
