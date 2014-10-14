<?php

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{
  /**
   * Constant which activate the admin mode
   */
  const ENABLE_ADMIN = true;

  public function registerBundles()
  {
    $bundles = array(
      new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
      new Symfony\Bundle\SecurityBundle\SecurityBundle(),
      new Symfony\Bundle\TwigBundle\TwigBundle(),
      new Symfony\Bundle\MonologBundle\MonologBundle(),
      new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle(),
      new Symfony\Bundle\AsseticBundle\AsseticBundle(),
      new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
      new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),
      new JMS\AopBundle\JMSAopBundle(),
      new JMS\DiExtraBundle\JMSDiExtraBundle($this),
      new JMS\SecurityExtraBundle\JMSSecurityExtraBundle(),
      new WhiteOctober\PagerfantaBundle\WhiteOctoberPagerfantaBundle(),


      new fibe\SecurityBundle\fibeSecurityBundle(),
      new fibe\RestBundle\fibeRestBundle(),
      new FOS\UserBundle\FOSUserBundle(),
      new Lexik\Bundle\FormFilterBundle\LexikFormFilterBundle(),
      new HWI\Bundle\OAuthBundle\HWIOAuthBundle(),
      new JMS\SerializerBundle\JMSSerializerBundle(),
      new FOS\RestBundle\FOSRestBundle(),
      new fibe\FrontendBundle\FrontendBundle(),
      new fibe\EventBundle\fibeEventBundle(),
      new fibe\ContentBundle\fibeContentBundle(),
      new fibe\CommunityBundle\fibeCommunityBundle(),

    );

    if (in_array($this->getEnvironment(), array('dev', 'test')))
    {
      $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
      $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
      $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
    }

    if (self::ENABLE_ADMIN)
    {
      $bundles[] = new Sonata\DoctrineORMAdminBundle\SonataDoctrineORMAdminBundle();
      $bundles[] = new Sonata\CoreBundle\SonataCoreBundle();
      $bundles[] = new Sonata\BlockBundle\SonataBlockBundle();
      $bundles[] = new Knp\Bundle\MenuBundle\KnpMenuBundle();
      $bundles[] = new Sonata\AdminBundle\SonataAdminBundle();
    }

    return $bundles;
  }

  public function registerContainerConfiguration(LoaderInterface $loader)
  {
    $loader->load(__DIR__ . '/config/config_' . $this->getEnvironment() . '.yml');
  }
}
