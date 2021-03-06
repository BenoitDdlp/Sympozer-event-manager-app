<?php

namespace fibe\ContentBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;

/**
 * RoleRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class RoleRepository extends EntityRepository
{


    /**
     * filtering with all parameters difned
     * @param QueryBuilder $qb : query builder to add the filter to
     * @param array $params : the field to filter on
     * @return QueryBuilder $qb : modified query builder
     */
    public function filter(QueryBuilder $qb, $params)
    {
        if (isset($params['mainEventId']))
        {
            $qb->andWhere('qb.mainEvent = :mainEventId');
            $qb->setParameter('mainEventId', $params['mainEventId']);
        }

        if (isset($params['id']))
        {
            $qb
                ->andWhere('qb.id = :id')
                ->setParameter('id', $params['id']);
        }


        if(isset($params['ids'])) {

            $qb
                ->andWhere($qb->expr()->in('qb.id', $params['ids']))
            ;
        }

        if(isset($params['roleLabelIds'])) {

            $qb
                ->leftJoin('qb.roleLabel', 'rol')
                ->andWhere($qb->expr()->in('rol.id', $params['roleLabelIds']));

        }



        if (isset($params['personId']))
        {
            $qb
                ->leftJoin('qb.person', 'p')
                ->andWhere('p.id = :personId')
                ->setParameter('personId', $params['personId']);
        }


        if (isset($params['roleLabelId']))
        {
            $qb
                ->andWhere('qb.roleLabel = :roleLabelId')
                ->setParameter('roleLabelId', $params['roleLabelId']);
        }

        return $qb;
    }
}
